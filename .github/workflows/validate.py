#!/usr/bin/env python
"""
Parse all Avro schema in this repository.

Errors are output in the GNU error format
<https://www.gnu.org/prep/standards/html_node/Errors.html>.
"""
import json
from glob import iglob
import sys

#from fastavro.schema import load_schema, SchemaParseException, UnknownType

failed = False

# for filename in iglob('*.avsc'):
#     try:
#         load_schema(filename)
#     except json.decoder.JSONDecodeError as e:
#         print(f'{filename}:{e.lineno}:{e.colno}: error: {e.msg}')
#         failed = True
#     except SchemaParseException as e:
#         print(f'{filename}: error: {e.args[0]}')
#         failed = True
#     except UnknownType as e:
#         print(f'{filename}: error: unknown type: {e.args[0]}')
#         failed = True

def validate(filename):
    with open(filename) as file:
        try:
            return json.load(file) # put JSON-data to a variable
        except json.decoder.JSONDecodeError:
            print('Invalid JSON') # in case json is invalid
        else:
            print('Valid JSON') # in case json is valid

for filename in iglob('**/*.json'):
    print(filename)
    validate(filename)

if failed:
    sys.exit(1)
