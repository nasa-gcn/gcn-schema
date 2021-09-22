#!/usr/bin/env python
"""
Parse all Avro schema in this repository.

Errors are output in the GNU error format
<https://www.gnu.org/prep/standards/html_node/Errors.html>.
"""
from json.decoder import JSONDecodeError
from glob import iglob
import sys

from fastavro.schema import load_schema, SchemaParseException, UnknownType

failed = False

for filename in iglob('*.avsc'):
    try:
        load_schema(filename)
    except JSONDecodeError as e:
        print(f'{filename}:{e.lineno}:{e.colno}: error: {e.msg}')
    except SchemaParseException as e:
        print(f'{filename}: error: {e.args[0]}')
        failed = True
    except UnknownType as e:
        print(f'{filename}: error: unknown type: {e.args[0]}')
        failed = True

if failed:
    sys.exit(1)
