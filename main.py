#!/usr1/local/anaconda_py3/ana37/bin//python
# 
# Name:        main.py
# Author:      Michael Preciado
# Description: Reads in the JSON files from the json subdirectory and uses a jinja
#              template to render the JSON Files in nice html pages. The output
#              is dumped to the html directory.
#             
#
import json
from jinja2 import Environment,FileSystemLoader

# Define the array  with the JSON files
array  = ["fermi.gbm.ground_pos-value.avsc", "time.avsc","spatial-addon.avsc","spatial-value.avsc"]


# Loop over each JSON file and apply the jinja template to each 
for x in (array):
  y =  "json/" + x;
  with open(y,"r") as d:
     timeFile = json.load(d)
     fileLoader = FileSystemLoader("templates");
     env = Environment(loader=fileLoader);
     rendered = env.get_template("tach.html.jinja").render(timeFile=timeFile,title=x)

  # Write the new html to a file
     output = "html/" + x + ".html" 
     f = open(output,"w") 
     f.write(rendered)
     f.close()


