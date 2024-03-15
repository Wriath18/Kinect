import spacy
import transformers
import cv2
import pandas
import en_core_med7_trf
from PIL import Image
import easyocr
import csv
import re
import torch
import google.generativeai as genai
from transformers import DPRContextEncoder, DPRContextEncoderTokenizer, DPRQuestionEncoder, DPRQuestionEncoderTokenizer
from transformers import AutoModelForCausalLM, AutoTokenizer
import pyttsx3
import speech_recognition as sr
from fuzzywuzzy import process

# medication_names = ["Zerostat", "Salbair", "Momeflo", "Levocat"]
medication_names = []
def image_text_extraction(image_path):
    reader = easyocr.Reader(['en'])
    final_image = image_processing(image_path=image_path)
    result = reader.readtext(final_image)
    txt = []
    for detection in result:
        # print(detection[1])
        txt.append(detection[1])
    print(txt)
    return " ".join(txt)


def image_processing(image_path):
    img = cv2.imread(image_path)
    reizised_img = img[200:1500, :]
    return reizised_img



def med7_model():
    med7 = en_core_med7_trf.load()
    col_dict = {}
    seven_colours = ['#e6194B', '#3cb44b', '#ffe119', '#ffd8b1', '#f58231', '#f032e6', '#42d4f4']
    for label, color in zip(med7.pipe_labels['ner'], seven_colours):
        col_dict[label] = color

    options = {'ents': med7.pipe_labels['ner'], 'colors': col_dict}

    text = image_text_extraction("D:\\Programming-1\\New-Project\\Adobe Scan Mar 03, 2024_1.jpg")

    doc = med7(text)

    drug_data = []
    for ent in doc.ents:
        if ent.label_ == "DRUG":
            medication_names.append(ent.text)
            drug_data.append([ent.text, extract_frequency(ent.text, text)])  # Add frequency
    print(medication_names)
    # Write drug data to CSV file
    with open("drug_info_1.csv", "w", newline="") as csvfile:
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


retriever_model_name = "facebook/dpr-ctx_encoder-single-nq-base"
retriever_tokenizer = DPRQuestionEncoderTokenizer.from_pretrained(retriever_model_name)
retriever_model = DPRContextEncoder.from_pretrained(retriever_model_name)

generator_model_name = "microsoft/DialoGPT-medium"
generator_tokenizer = AutoTokenizer.from_pretrained(generator_model_name)
generator_model = AutoModelForCausalLM.from_pretrained(generator_model_name)

def ask_about_drug(user_question):
    drug_info = {}
    with open("drug_info.csv", "r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            drug_name, drug_frequency = row
            drug_info[drug_name.lower()] = drug_frequency

    print(drug_info) # check 1
    # user_question = "What are the side effects of salbair"

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
            genai.configure(api_key='AIzaSyDlyEdausw88tQwGC7BOnF4AtmgfMOvsoA')  
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(user_question)
            passage = response.text
        except Exception as e:
            passage = f"Error accessing Gemini API: {e}"

    input_ids = generator_tokenizer.encode(user_question + " " + passage, return_tensors="pt")
    output = generator_model.generate(input_ids, max_new_tokens=100, num_return_sequences=1, pad_token_id=generator_tokenizer.eos_token_id)
    response = generator_tokenizer.decode(output[0], skip_special_tokens=True)

    print("Response:", response)
    speak(response)


def speak(text):
    voice_id = 1
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[voice_id].id)
    engine.setProperty('rate', 190) 
    engine.setProperty('volume', 0.9)
    engine.say(text)
    engine.runAndWait()

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
            new_txt = autocorrect_medication(txt)
            print(new_txt)
            ask_about_drug(new_txt)
            print("Stoppped")
            return txt
        



# List of medication names


# Function to autocorrect medication names
# def autocorrect_medication(input_text):
#     # Split input into individual words
#     words = input_text.split()
#     corrected_words = []
#     for word in words:
#         closest_match, similarity = process.extractOne(word, medication_names)
#         if similarity >= 60:  # Adjust similarity threshold as needed
#             corrected_words.append(closest_match)
#         else:
#             corrected_words.append(word)  # If no close match found, keep the original word
#     return ' '.join(corrected_words)

def autocorrect_medication(input_text):
    # Split input into individual words
    words = input_text.split()
    corrected_words = []
    for word in words:
        closest_match = process.extractOne(word, medication_names)
        if closest_match is not None:
            matched_word, similarity = closest_match
            if similarity >= 60:  # Adjust similarity threshold as needed
                corrected_words.append(matched_word)
            else:
                corrected_words.append(word)  # If similarity is too low, keep the original word
        else:
            corrected_words.append(word)  # If no match found, keep the original word
    return ' '.join(corrected_words)

# Example usage
# user_input = "What is the frequency of salber"
# corrected_input = autocorrect_medication(user_input)
# print("Corrected input:", corrected_input)


# med7_model()
input_speech()


    