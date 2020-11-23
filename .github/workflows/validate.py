#!/usr/bin/env python
from json.decoder import JSONDecodeError
from glob import iglob
from fastavro.schema import load_schema, SchemaParseException, UnknownType

for filename in iglob('*.avsc'):
    try:
        load_schema(filename)
    except (JSONDecodeError, SchemaParseException) as e:
        print(f'error: {filename}: {e.args[0]}')
    except UnknownType as e:
        print(f'error: {filename}: unknown type: {e.args[0]}')
