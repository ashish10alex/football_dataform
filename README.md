
### How to use

Open the repository in a VSCode devcontainer  and run the following 

```bash
gcloud init
gloud auth application-default login
gcloud config set project drawingfire-b72a8 # replace with your gcp project id
```

#### Personal notes 

Create a new Dataform project

```bash
dataform init --default-database drawingfire-b72a8 --default-location europe-west2
```
