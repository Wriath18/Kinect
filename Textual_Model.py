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
          genai.configure(api_key='AIzaSyDlyEdausw88tQwGC7BOnF4AtmgfMOvsoA')
          model = genai.GenerativeModel('gemini-pro')
          response = model.generate_content(user_question)
          passage = response.text
          passage = response.text.replace("*","")
          print(passage)
        except Exception as e:
          print(f"Error accessing Gemini API: {e}")
    else:
      print(f"Sorry, I don't have information about '{drug_name}'.")


ask_about_drug_text()