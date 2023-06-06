# GCN Schema

This repository contains the schema for GCN Notices as distributed by [GCN Kafka](https://gcn.nasa.gov). Schema are one step in the process for setting up [New Notice Producers](https://gcn.nasa.gov/docs/producers).

The preferred alert format for GCN Kafka is JSON. We have designed a set of core schema which serve as the building blocks for new GCN Notices. Instrument-specific schema can also be created, but we request that you utilize the core schema as much as possible.

Please add your schema to this repository under <code>gcn/notices/<i>mission</i>/</code> and submit a pull request for the GCN Team to review.

The GCN team is happy to iterate with the producers on their schema contents and format.
Your pipeline will generate JSON files following these schema and send alerts to GCN as described in [New Notice Producers](https://gcn.nasa.gov/docs/producers).

## Version Updates

To create a new tagged version, update the `version` property in `package.json` and create a new PR into main. When this PR is merged, actions will trigger that will update the `$id` and `$schema` properties to include `?version=....`. This commit will get tagged, then the action will reset the paths to `?version=main` so that the latest commit on the main branch always points to main.
