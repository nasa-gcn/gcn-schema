# tach-avro-schema

The new TACH system will be using a unified schema format for Kafka topics.
The unified schema will allow data from different instruments to be compared in
a more straightforward way than is currently possible with the existing GCN
formats.  The GCN Notices will be validated automatically by the
Kafka broker against pre-defined schema. The schema will be developed in
collaboration with the TACH/GCN team and the producer mission/instrument.
Instrument/Mission Teams will be able to modify their instrument specific
schema.
