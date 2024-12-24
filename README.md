
### How to use

Open the repository in a [VSCode Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)  and run the following 

```bash
gcloud init
gloud auth application-default login
gcloud config set project drawingfire-b72a8 # replace with your gcp project id
```

#### TODOs

- [ ] Add example of incremental models
- [ ] Add custom assertion
- [ ] Add example of using a javascript function 
- [ ] Add a docs.js file where documentation of columns will be pulled from
- [ ] Create another dataset in BigQuery and connect to it in the pipeline

#### Personal notes 

Create a new Dataform project

```bash
dataform init --default-database drawingfire-b72a8 --default-location europe-west2
```
