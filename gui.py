import PySimpleGUI as sg
import final
# Define your Python functions to be linked with buttons
def function_1():
    # Your function logic here
    print("Function 1 executed!")

def function_2():
    # Your function logic here
    print("Function 2 executed!")

def function_3():
    # Your function logic here
    print("Function 3 executed!")

def function_4():
    # Your function logic here
    print("Function 4 executed!")

# Layout for the GUI
layout = [
    [sg.Text("This is a simple GUI")],
    [sg.Button("Button 1", key="BUTTON_1"), sg.Button("Button 2", key="BUTTON_2")],
    [sg.Button("Button 3", key="BUTTON_3"), sg.Button("Button 4", key="BUTTON_4")]
]

# Create the window
window = sg.Window("My GUI", layout)

# Event loop to handle button clicks
while True:
    event, values = window.read()
    if event == sg.WIN_CLOSED or event == 'Cancel':  # exit if window is closed
        break

    # Check which button was clicked and call the corresponding function
    if event == 'BUTTON_1':
        final.med7_model()
    elif event == 'BUTTON_2':
        final.input_speech()
    elif event == 'BUTTON_3':
        function_3()
    elif event == 'BUTTON_4':
        function_4()

# Close the window
window.close()
