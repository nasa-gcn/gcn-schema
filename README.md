# GCN Schema

This repository contains the schemas necessary for crafting new GCN notices. It also includes mission-specific schemas and illustrative examples, which are distributed by [GCN Kafka](https://gcn.nasa.gov). These schemas are one of the important step in the process of establishing [New Notice](https://gcn.nasa.gov/docs/producers) for both existing and new missions.

The alert format for new Notices over GCN Kafka is JSON. We have designed a set of core schema which serve as the building blocks for new GCN Notices. Instrument-specific schema can also be created, but we request that you utilize the core schema as much as possible.

Please add your schema to this repository under <code>gcn/notices/<i>mission</i>/</code> and submit a pull request for the GCN Team to review. The GCN team is happy to iterate with the producers on their schema contents and format. Your pipeline will generate JSON files following these schema and send alerts to GCN as described in [New Notice Producers](https://gcn.nasa.gov/docs/producers).

## How To Release

1.  Clone the parent repo (nasa-gcn/gcn-schema).

        git clone git@github.com:nasa-gcn/gcn-schema.git
        cd gcn-schema

2.  Use the following command to initiate the [release](https://semver.org) process: `npm version [ major | minor | patch ]`

    This command will handle the intermediate steps of updating and committing the path changes in each file as defined in the `version` and `postversion` npm scripts

3.  Review the changes with `git log -p` to make sure that each file is appropriately updated.

4.  Finally, push both the commit and the tag:

        git push && git push origin <tag name>

This will make release officially available for use.
