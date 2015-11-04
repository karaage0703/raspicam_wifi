# -*- coding: utf-8 -*-
import subprocess
import picamera
import os
from time import sleep

shutter_numb = 0
#home_dir = '/home/pi/photo'
home_dir = '/usr/share/webiopi/htdocs/rpicam/photo'

cmd ="sudo killall mjpg_streamer"
subprocess.call(cmd, shell=True)

def cameraLoad():
    global shutter_numb
    filename = os.path.join(home_dir, 'camera.set')
    fp = open(filename)
    tmp_shutter_numb = fp.readlines() 
    tmp2_shutter_numb = tmp_shutter_numb[0].rstrip()
    shutter_numb = int(tmp2_shutter_numb)
    fp.close()
 
def cameraSave():
    filename = os.path.join(home_dir, 'camera.set')
    fp = open(filename, 'w')
    fp.write(str(shutter_numb))
    fp.close()

def shutter():
    global shutter_numb
    shutter_numb +=1
    cameraSave()

    filename = os.path.join(home_dir, str("{0:06d}".format(shutter_numb)) + '.jpg')
    photofile = open(filename, 'wb')
    print(photofile)

    with picamera.PiCamera() as camera:
        camera.resolution = (2592,1944)
        camera.start_preview()
        sleep(1.000)
        camera.capture(photofile)

    photofile.close()

cameraLoad()
shutter()

cmd ="stream.sh"
subprocess.call(cmd, shell=True)
