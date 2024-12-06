# GCN Schema

This repository contains the schemas for crafting new GCN notices. It also includes mission-specific schemas and illustrative examples, which are distributed by [GCN Kafka](https://gcn.nasa.gov). The formulation of mission schemas is one step in the process for setting up [New Notice Producers](https://gcn.nasa.gov/docs/notices/producers).

The alert format for new Notices over GCN Kafka is JavaScript Object Notation (JSON), a widely adopted Internet data format. We have designed a set of core schema which serve as the building blocks for new GCN Notices. Instrument-specific schema can also be created, but we request that you utilize the core schema as much as possible.

Please add your schema to this repository under <code>gcn/notices/<i>mission</i>/</code> and submit a pull request for the GCN Team to review. The GCN team is happy to iterate with the producers on their schema contents and format. Your pipeline will generate JSON files following these schema and send alerts to GCN as described in [New Notice Producers](https://gcn.nasa.gov/docs/notices/producers).

## How to Contribute

To get started, fork the [nasa-gcn/gcn-schema](https://github.com/nasa-gcn/gcn-schema) repository on GitHub and clone it on your computer. If you are new to GitHub, refer to our [GitHub primer](https://gcn.nasa.gov/docs/contributing/github).

After you have forked and cloned the repository, make sure that Node.js and NPM are installed on your computer. There are several options to install Node.js and NPM. Pick _one_ of the following:

- Download and run [the Node.js installer for your operating system](https://nodejs.org/en/download/).
- Install and use the [Node Version Manager, nvm](https://github.com/nvm-sh/nvm).
- Install using a [package manager](https://nodejs.org/en/download/package-manager/).

Finally, run the following command inside the repository working directory to install the pre-commit hooks for code formatting and syntax checking:

```
npm install
```

## How To Release

1.  Clone the parent repo (nasa-gcn/gcn-schema).

        git clone git@github.com:nasa-gcn/gcn-schema.git
        cd gcn-schema

2.  Install necessary npm packages

        npm install

3.  Tag a new version by running the following command: `npm version [ major | minor | patch ]`. Choose `major`, `minor`, or `patch` depending on the kind of update according to [Semantic Versioning](https://semver.org) rules. Updates are categorized as major, minor, or patch, depending on the type of change:

    - Major revisions are for changes that break compatibility; they are not necessarily limited to core schema changes.
    - Minor revisions are for introduction of new features: new schema, or new fields in existing schema.
    - Patch revisions are for bug fixes that do not break compatibility.

    This command will handle the intermediate steps of updating and committing the path changes in each file as defined in the `version` and `postversion` npm scripts.

4.  Review the changes with `git log -p` to make sure that each file is appropriately updated.

5.  Finally, push both the commit and the tag:

        git push && git push origin <tag name>

This will make the release available for use. For subsequent releases:

1.  Pull the latest state of the main branch

        git pull

2.  Follow the above steps from Step 3 on.

**Note**: Version tagging is managed by the GCN maintainers. Producers, when ready to publish alerts, please contact the GCN maintainers to tag a new version of the schema.
