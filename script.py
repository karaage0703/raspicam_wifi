# -*- coding: utf-8 -*-
import webiopi
import time
import wiringpi2 as wiringpi
import os

from time import sleep

import subprocess
import picamera

# camera setting
#shutter_numb = 0
#home_dir = '/home/pi/photo'

# Enable webiopi debug output
webiopi.setDebug()

# Get GPIO library
GPIO = webiopi.GPIO

# Function is called when WebIOPi start up
def setup():
    webiopi.debug("Script with macros - Setup")

# Loop function by WebIOPi
def loop():
    webiopi.sleep(5)        

# Function when WebIOPi is finished
def destroy():
    webiopi.debug("Script with macros - Destroy")

@webiopi.macro
def shutterCamera(tmp):
    cmd ="python3 /usr/share/webiopi/htdocs/raspicam_wifi/shutter.py"
    subprocess.call(cmd, shell=True)

@webiopi.macro
def shutdownCamera(tmp):
#    cmd ="sudo /bin/systemctl stop webiopi.service"
#    subprocess.call(cmd, shell=True)
    cmd ="/sbin/shutdown -h now"
    subprocess.call(cmd, shell=True)

