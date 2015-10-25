# -*- coding: utf-8 -*-
import webiopi
import time
import wiringpi2 as wiringpi
import os

from time import sleep

import subprocess
import picamera

# camera setting
shutter_numb = 0
home_dir = '/home/pi/photo'

# デバッグ出力を有効に
webiopi.setDebug()

# GPIOライブラリの取得
GPIO = webiopi.GPIO

# WebIOPiの起動時に呼ばれる関数
def setup():
    webiopi.debug("Script with macros - Setup")

# WebIOPiにより繰り返される関数
def loop():
    webiopi.sleep(5)        

# WebIOPi終了時に呼ばれる関数
def destroy():
    webiopi.debug("Script with macros - Destroy")

@webiopi.macro
def shutterCamera(tmp):
    cmd ="python3 /usr/share/webiopi/htdocs/rpicam/shutter.py"
    subprocess.call(cmd, shell=True)

    #cmd ="tw 写真撮れたよ〜 --file=/home/pi/photo/capture.jpg --yes"
    #subprocess.call(cmd, shell=True)

