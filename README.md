# tach-avro-schema

The new TACH system will be using a unified schema format for Kafka topics.
The Confluent Schema Registry will be used to manage the data format of the new
TACH topics.  The Schema Registry provides support for tracking new versions.
The unified schema will allow data from different instruments to be compared in
a more straight forward way than is currently possible with the existing GCN
formats.  The GCN Notices (Kafka topics) will be validated automatically by the
Kafka broker against pre-defined schema. The schema are developed in
collaboration between the TACH/GCN team and the producer mission/instrument.
Instrument/Mission Teams will be able to modify their instrument specific
schema.
