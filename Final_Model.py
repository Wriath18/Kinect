import spacy
import en_core_med7_trf
import easyocr
from PIL import Image
import cv2
import pandas as pd
import csv
import re
import pyttsx3
import transformers
import torch
import google.generativeai as genai
from transformers import DPRContextEncoder, DPRContextEncoderTokenizer, DPRQuestionEncoder, DPRQuestionEncoderTokenizer
from transformers import AutoModelForCausalLM, AutoTokenizer
import speech_recognition as sr
from fuzzywuzzy import process
import pyttsx3
import os
import requests
import csv
from pymongo import MongoClient 
from pymongo import MongoClient
from bson.objectid import ObjectId
import pymongo
from bson import ObjectId
from PyQt5 import QtCore, QtGui, QtWidgets

medication_names = ["Zerostat", "salbair", "Momeflo","Levocet"]

#models
retriever_model_name = "facebook/dpr-ctx_encoder-single-nq-base"
retriever_tokenizer = DPRQuestionEncoderTokenizer.from_pretrained(retriever_model_name)
retriever_model = DPRContextEncoder.from_pretrained(retriever_model_name)
generator_model_name = "microsoft/DialoGPT-medium"
generator_tokenizer = AutoTokenizer.from_pretrained(generator_model_name)
generator_model = AutoModelForCausalLM.from_pretrained(generator_model_name)



#main fucntions

#text extraction from image
def detection():
    reader = easyocr.Reader(['en'])
    image_path = "new_image.jpg"
    final_image = image_processing(image_path=image_path)
    result = reader.readtext(final_image)
    txt = []
    for detection in result:
        # print(detection[1])
        txt.append(detection[1])

    return " ".join(txt)

#image processing
def image_processing(image_path):
    img = cv2.imread(image_path)
    reizised_img = img[200:1500, :]
    return reizised_img


#med7 model (Training)
def med7_model():
  global medication_names
  medication_names = []
  med7 = en_core_med7_trf.load()
  col_dict = {}
  seven_colours = ['#e6194B', '#3cb44b', '#ffe119', '#ffd8b1', '#f58231', '#f032e6', '#42d4f4']
  for label, color in zip(med7.pipe_labels['ner'], seven_colours):
    col_dict[label] = color

  options = {'ents': med7.pipe_labels['ner'], 'colors': col_dict}

  # Text containing medical concepts
  text = detection()  # Replace with your detection function

  doc = med7(text)

  drug_data = []
  for ent in doc.ents:
    if ent.label_ == "DRUG":
      medication_names.append(ent.text)
      drug_data.append([ent.text, extract_frequency(ent.text, text)])  # Add frequency

  # Write drug data to CSV file
  with open("drug_info_.csv", "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Drug Name", "Frequency"])
    writer.writerows(drug_data)

  spacy.displacy.render(doc, style='ent', jupyter=True, options=options)

def extract_frequency(drug_name, text):
  # Implement your logic to extract frequency from the text based on drug_name
  # This example provides a basic placeholder, replace with your actual implementation
  frequency_pattern = re.compile(f"{re.escape(drug_name)} \((.*?)\)")
  # Example pattern for finding frequency near drug_name
  match = re.search(frequency_pattern, text)
  if match:
    return match.group(1)  # Extract the matched frequency
  else:
    return None  # Return None if frequency not found

#Speaking Function
def speak(text):
    voice_id = 1
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[voice_id].id)
    engine.setProperty('rate', 190) 
    engine.setProperty('volume', 0.9)
    engine.say(text)
    engine.runAndWait()


#ask about drug (VOICE)
def ask_about_drug(user_question):
    drug_info = {}
    with open("drug_info.csv", "r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            drug_name, drug_frequency = row
            drug_info[drug_name.lower()] = drug_frequency

    print(drug_info) # check 1
    # user_question = "How many times do i have to take salbair ?"

    query_tokens = user_question.lower().split()
    print(query_tokens)
    drug_name = None
    for token in query_tokens:
        if token in drug_info:
            drug_name = token
            break
    if drug_name:
        passage = f"{drug_name.capitalize()} is taken {drug_info[drug_name]}"
    else:
        try:
            genai.configure(api_key='--')  # Replace with your API key
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(user_question)
            passage = response.text
        except Exception as e:
            passage = f"Error accessing Gemini API: {e}"

    input_ids = generator_tokenizer.encode(user_question + " " + passage, return_tensors="pt")
    output = generator_model.generate(input_ids, max_new_tokens=100, num_return_sequences=1, pad_token_id=generator_tokenizer.eos_token_id)
    response = generator_tokenizer.decode(output[0], skip_special_tokens=True)
    response = response.replace("*","")

    print("Response:", response)
    speak(response)


#ask about user (TEXT)
def ask_about_drug_text():
  drug_info = {}
  with open("drug_info.csv", "r") as file:
    reader = csv.reader(file)
    next(reader)
    for row in reader:
      drug_name, drug_frequency = row
      drug_info[drug_name.lower()] = drug_frequency

  while True:
    user_question = input("What would you like to know about a medication? (or type 'quit' to exit): ")
    user_question = user_question.lower()

    if user_question == 'quit':
      break

    query_tokens = user_question.split()
    drug_name = None
    for token in query_tokens:
      if token in drug_info:
        drug_name = token
        break

    if drug_name:
      if any(word in user_question.lower() for word in ['frequency', 'times', 'take']):
        passage = f"{drug_name.capitalize()} is taken {drug_info[drug_name]} times per day."  
        print(passage)
      else:
        try:
          genai.configure(api_key='--')
          model = genai.GenerativeModel('gemini-pro')
          response = model.generate_content(user_question)
          passage = response.text
          passage = response.text.replace("*","")
          print(passage)
        except Exception as e:
          print(f"Error accessing Gemini API: {e}")
    else:
      print(f"Sorry, I don't have information about '{drug_name}'.")

#LItsening
def input_speech():
    while True:
        print(f"\nListening .....")
        sp = sr.Recognizer()
        with sr.Microphone() as source:
            sp.pause_threshold = 0.5
            sp.energy_threshold = 3500
            audio = sp.listen(source)
            txt = sp.recognize_google(audio, language="en-in")
            print(f"User says {txt}")
            new_txt = autocorrect_medication(txt, whitelist=whitelist)
            print(new_txt)
            ask_about_drug(new_txt)
            print("Stoppped")
            return txt


#AUTO CORRECT    
# def autocorrect_medication(input_text):
#     # Split input into individual words
#     words = input_text.split()
#     corrected_words = []
#     for word in words:
#         closest_match = process.extractOne(word, medication_names)
#         if closest_match is not None:
#             matched_word, similarity = closest_match
#             if similarity >= 85:  
#                 corrected_words.append(matched_word)
#             else:
#                 corrected_words.append(word)  
#         else:
#             corrected_words.append(word) 
#     return ' '.join(corrected_words)
def autocorrect_medication(input_text, threshold=80, whitelist=[]):
    words = input_text.split()
    corrected_words = []
    for word in words:
      
        closest_match = process.extractOne(word, medication_names)

        if closest_match is not None:
            matched_word, similarity = closest_match
            
            if similarity >= threshold and (len(matched_word) > len(word) * 0.75) and (matched_word.lower() != word.lower() and word.lower() not in whitelist):
                corrected_words.append(matched_word)
            else:
                corrected_words.append(word)
        else:
            corrected_words.append(word)
    return ' '.join(corrected_words)


whitelist = ["I", "you", "a", "an", "the"]

#IMAGE DOWNLOAD
def download_image(url, file_path):
    try:
        # Fetch the image content
        response = requests.get(url)
        if response.status_code == 200:
            # Save the image to the local file
            with open(file_path, 'wb') as file:
                file.write(response.content)
            print("Image downloaded successfully.")
        else:
            print("Failed to download image. Status code:", response.status_code)
    except Exception as e:
        print("An error occurred:", e)


#Import from db
def import_data_from_csv(file_path):
    try:
        with open(file_path, "r") as csvfile:
            csv_reader = csv.DictReader(csvfile)
            data_drug = []
            data_freq = []
            for row in csv_reader:
                data_drug.append(row['Drug Name'])
                data_freq.append(row['Frequency'])
            print("Data imported successfully!")
            return data_drug, data_freq
            
    except Exception as e:
        print(f"Error importing data from CSV: {e}")
        return None, None



def fetch():
    # Connect to MongoDB
    client = pymongo.MongoClient("--")
    db = client["seva-auth"]  # Replace "your-database" with the name of your MongoDB database
    collection = db["users"]  # Replace "your-collection" with the name of your MongoDB collection

    # Fetch the document containing the URL
    result = collection.find_one({"_id": ObjectId("65f52e5a3a62caefd818890a")})  # Replace "your-image-id" with the ID of the image document

    if result:
        download_url = result["currentPrescription"]
        current_directory = os.getcwd()

        # Local file name where you want to save the image (you can change the file extension if needed)
        local_file_name = "image.jpg"

        # Combine current directory and file name to get the full file path
        local_file_path = os.path.join(current_directory, local_file_name)
        download_image(download_url, local_file_path)
        print("Download URL:", download_url)
    else:
        print("Document not found")

    file_path = "drug_info.csv"
    
    user_id = "65f52e5a3a62caefd818890a"
    
    medicine, frequency = import_data_from_csv(file_path)
    if medicine is not None and frequency is not None:
        update_medicine_frequency_in_db(medicine, frequency, user_id)

def send_data_to_db():
    file_path = "drug_info.csv"
    user_id = "65f52e5a3a62caefd818890a"
    medicine, frequency = import_data_from_csv(file_path)
    if medicine is not None and frequency is not None:
        update_medicine_frequency_in_db(medicine, frequency, user_id)
    

#update in db
def update_medicine_frequency_in_db(medicine, frequency, user_id):
    try:
        # Replace the placeholders with your actual MongoDB connection string and database name
        client = MongoClient("--")
        db = client["seva-auth"]

        

        # Replace "your_collection_name" with the actual name of your collection
        collection = db["users"]

        # Assuming you have a specific ObjectID you want to update
        specific_object_id = ObjectId("65f52e5a3a62caefd818890a")

        # Prepare the data for the update
        data = {"medicine": medicine, "frequency": frequency}

        # Update the document with the specific ObjectID
        result = collection.update_one({"_id": specific_object_id}, {"$set": data})

        print(f"Matched {result.matched_count} document and modified {result.modified_count} document.")

    
    except Exception as e:
        print(f"Error updating medicine frequency in database: {e}")
        return False


#amazon sns
def send_emergency_sms():
    import boto3
    import botocore.exceptions
    # Replace with your actual credentials (get them from AWS IAM console)
    AWS_ACCESS_KEY_ID = '--'
    AWS_SECRET_ACCESS_KEY = '--/--+kcB+FJ'
    REGION_NAME = 'ap----1'  # Replace with your AWS region

    # Replace with your topic's ARN (find it in the SNS console)
    TOPIC_ARN = '--'

    # The message you want to send
    MESSAGE = 'EMERGENCY BUTTON HAS BEEN CLICKED AT YOUR HOME STATION : PLEASE CHECK !!!!!'

    PHONE_NUMBER = '+--'  # Replace with the phone number

    # Create an SNS client
    sns_client = boto3.client('sns',
                            aws_access_key_id=AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                            region_name=REGION_NAME)

    # Subscribe the phone number to the SNS topic
    try:
        sns_client.subscribe(
            TopicArn=TOPIC_ARN,
            Protocol='sms',
            Endpoint=PHONE_NUMBER
        )
        print(f"Subscribed phone number {PHONE_NUMBER} to topic {TOPIC_ARN}")
    except botocore.exceptions.ClientError as error:
        print(f"Error subscribing phone number: {error}")

    # Publish the message
    try:
        response = sns_client.publish(
            TopicArn=TOPIC_ARN,
            Message=MESSAGE
        )
        print(f"Message published successfully! Message ID: {response['MessageId']}")
    except botocore.exceptions.ClientError as error:
        print(f"Error sending message: {error}")


#GUI
    
# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'gui_1.ui'
#
# Created by: PyQt5 UI code generator 5.15.9
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.

from PyQt5 import QtCore, QtGui, QtWidgets

# Placeholder functions for now, replace with your actual logic
def fetch_data():
    fetch()
    # Add your data fetching logic here (e.g., using APIs, databases)

def assistant():
    user_input = ask_about_drug_text()
    if user_input is not None:
        # Display the user input in the GUI or perform any other actions
        print("User input:", user_input)
    else:
        print("User chose to quit")

    # Add your assistant logic here (e.g., opening a help window, web search)

def voice_assistant():
    input_speech()
    # Add your voice assistant logic here (e.g., speech recognition, voice commands)

def emergency():
    send_emergency_sms()
    # Add your emergency logic here (e.g., call emergency services, display instructions)

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 600)
        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        self.pushButton = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton.setGeometry(QtCore.QRect(30, 140, 341, 171))
        font = QtGui.QFont()
        font.setFamily("Futura Md BT")
        font.setPointSize(20)
        font.setBold(True)
        font.setWeight(75)
        self.pushButton.setFont(font)
        self.pushButton.setObjectName("pushButton")
        self.pushButton.clicked.connect(fetch_data)  # Connect button click to function

        self.pushButton_2 = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton_2.setGeometry(QtCore.QRect(420, 140, 331, 171))
        font = QtGui.QFont()
        font.setFamily("Futura Md BT")
        font.setPointSize(20)
        font.setBold(True)
        font.setWeight(75)
        self.pushButton_2.setFont(font)
        self.pushButton_2.setObjectName("pushButton_2")
        self.pushButton_2.clicked.connect(assistant)  # Connect button click to function

        self.pushButton_3 = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton_3.setGeometry(QtCore.QRect(30, 350, 341, 161))
        font = QtGui.QFont()
        font.setFamily("Futura Md BT")
        font.setPointSize(20)
        font.setBold(True)
        font.setWeight(75)
        self.pushButton_3.setFont(font)
        self.pushButton_3.setObjectName("pushButton_3")
        self.pushButton_3.clicked.connect(voice_assistant)  # Connect button click to function

        self.pushButton_4 = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton_4.setGeometry(QtCore.QRect(420, 350, 331, 161))
        font = QtGui.QFont()
        font.setFamily("Futura Md BT")
        font.setPointSize(20)
        font.setBold(True)
        font.setWeight(75)
        self.pushButton_4.setFont(font)
        self.pushButton_4.setObjectName("pushButton_4")
        self.pushButton_4.clicked.connect(emergency)  # Connect button click to function

        self.label = QtWidgets.QLabel(self.centralwidget)
        self.label.setGeometry(QtCore.QRect(280, 40, 221, 61))
        font = QtGui.QFont()
        font.setFamily("Futura Md BT")
        font.setPointSize(36)
        font.setBold(True)
        font.setWeight(75)
        self.label.setFont(font)
        self.label.setObjectName("label")

        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 26))
        self.menubar.setObjectName("menubar")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)  # Call retranslateUi() function to set text

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.pushButton.setText(_translate("MainWindow", "FETCH DATA"))
        self.pushButton_2.setText(_translate("MainWindow", "ASSISTANT"))
        self.pushButton_3.setText(_translate("MainWindow", "VOICE ASSISTANT"))
        self.pushButton_4.setText(_translate("MainWindow", "EMERGENCY"))
        self.label.setText(_translate("MainWindow", "KINECT"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())
