# Ad Hoc Env
Scripts to set up ad hoc testing environments for git projects.

- [Ad Hoc Env](#ad-hoc-env)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Setup](#setup)


## Prerequisites

Install gcloud, kubectl

## Getting started

### Setup
  1.  First we need to set up and define the cluster and then get the credentials.
      ```bash
      # Create the cluster
      $ gcloud container clusters create <cluster-name>

      # Allows your machine to connect to the cluster
      $ gcloud container clusters get-credentials <cluster-name>
      ```
      > Optional: You can do this through the GCP dashboard here https://console.cloud.google.com/kubernetes/list.
  2.
