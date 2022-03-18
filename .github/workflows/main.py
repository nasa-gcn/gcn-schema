#!/usr/bin/env python
# Name:        main.py
# Author:      Michael Preciado
# Description: Reads in the JSON files from the json subdirectory and uses a
#              jinja template to render the JSON Files in nice html pages.
#              The output is dumped to the html directory.
#
import json
import os
import glob
from jinja2 import Environment, FileSystemLoader


def renderTemplate(template, tachFile, fileName):
    fileLoader = FileSystemLoader("templates")
    env = Environment(loader=fileLoader)
    env.trim_blocks = True;
    env.lstrip_blocks = True;
    rendered = env.get_template(template).render(tachFile=tachFile,
                                                 title=fileName)
    return rendered


def writeToFile(rendered, fileName):
    with open(f'html/{fileName}.html', 'w') as writer:
        writer.write(rendered)


def run(template, files):
    # Loop over each JSON file and apply the jinja template to each
    names = [os.path.basename(x) for x in (files)]
    for fileName in names:
        with open("../../" + fileName, "r") as d:
            tachFile = json.load(d)

        # Get rendered template
        rendered = renderTemplate(template, tachFile, fileName)

        # Write the new html to a file
        writeToFile(rendered, fileName)


if __name__ == "__main__":
    # Store the JSON file names
    files = glob.glob('../../*avsc')

    # Define the Jinja template
    template = 'tach.html.jinja'

    # Run (generate html for each tach file by using the jinja template)
    run(template, files)
