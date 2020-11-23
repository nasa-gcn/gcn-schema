#!/usr/bin/env python
from json.decoder import JSONDecodeError
from glob import iglob
import sys

from fastavro.schema import load_schema, SchemaParseException, UnknownType

failed = False

for filename in iglob('*.avsc'):
    try:
        load_schema(filename)
    except (JSONDecodeError, SchemaParseException) as e:
        print(f'error: {filename}: {e.args[0]}')
        failed = True
    except UnknownType as e:
        print(f'error: {filename}: unknown type: {e.args[0]}')
        failed = True

if failed:
    sys.exit(1)
