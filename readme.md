# Recognizing digits with Kubeflow on Cisco IKS

Deploy Kubeflow on Cisco Intersight and create a ML pipeline for a digit recognizer application.

**Steps**:

* Create Kubernetes Cluster from scratch with Cisco Intersight
* Deploy Kubeflow 1.5 with Cisco Intersight
* Access Kubeflow UI
* Create Jupyter Notebook and use it to explore the digit recognizer application
* Create a ML pipeline with Kubeflow Pipelines
* Create a simple web-application to mouse-draw the digits with Javascript + HTML5 canvas
* Serve the model with Kserve

**Components**:

* Cisco Intersight
* Kubeflow 1.5
* Kubernetes 1.21
* Hardware: Cisco UCS Server

## 1. Deploy Kubernetes Cluster with Cisco Intersight

[Watch an introduction to Intersight Kubernetes Service](https://www.youtube.com/watch?v=wxQRDwRO4-Y)

We will use the Intersight Kubernetes Service (IKS) to build the Kubernetes cluster and the Intersight Cloud Orchestrator (ICO) to write a deployment workflow for Kubeflow.
IKS allows you to build 100% upstream Kubernetes clusters with all necessary services for production. Monitoring comes out of the box, networking and ingress load balancers are already set up and service mesh management is already included.

![](images/kubernetes_workflow.png)

## 2. Install Kubeflow with ICO

Now that we have the cluster, we can write our deployment in ICO. We are going to do a custom installation using Kubeflow version 1.5. To do this, we will need a copy of the Kubeflow GitHub repository. We can then build our own yaml files using kustomize, which we can then apply to our Kubernetes cluster. Our ICO workflow mirrors these same three steps.

![](images/kubeflow_workflow.png)

> **Watch the whole process in [this video](https://www.youtube.com/watch?v=saRVAFM6H6I)!**


You can check with kubectl if all pods are coming up successfully: 

```
flpachin@FLPACHIN-M-MY32 ~ % kubectl get pods --all-namespaces
NAMESPACE                   NAME                                                              READY   STATUS      RESTARTS   AGE
auth                        dex-5ddf47d88d-cksfj                                              1/1     Running     1          3h7m
cert-manager                cert-manager-7b8c77d4bd-m4zht                                     1/1     Running     0          3h7m
cert-manager                cert-manager-cainjector-7c744f57b5-nzfb4                          1/1     Running     0          3h7m
cert-manager                cert-manager-webhook-fcd445bc4-7fkj4                              1/1     Running     0          3h7m
cluster-registry            essential-cluster-registry-controller-7f57bcd76-6qkms             1/1     Running     0          22h
iks                         apply-cloud-provider-97dsf                                        0/1     Completed   0          22h
iks                         apply-cni-j6wc4                                                   0/1     Completed   0          22h
iks                         apply-essential-cert-ca-qgmjk                                     0/1     Completed   0          22h
iks                         apply-essential-cert-manager-dw79m                                0/1     Completed   0          22h
iks                         apply-essential-cluster-registry-dg7dz                            0/1     Completed   0          22h
iks                         apply-essential-metallb-85xv2                                     0/1     Completed   0          22h
iks                         apply-essential-nginx-ingress-lz9qc                               0/1     Completed   0          22h
iks                         apply-essential-registry-7rgk5                                    0/1     Completed   0          22h
iks                         apply-essential-vsphere-csi-2s59w                                 0/1     Completed   0          22h
iks                         ccp-helm-operator-cf8cdfb5f-nf84p                                 1/1     Running     0          22h
iks                         ccp-registry-updater-essential-cert-manager-0                     1/1     Running     0          22h
iks                         ccp-registry-updater-essential-cluster-registry-0                 1/1     Running     0          22h
iks                         ccp-registry-updater-essential-metallb-0                          1/1     Running     0          22h
iks                         ccp-registry-updater-essential-nginx-ingress-0                    1/1     Running     0          22h
iks                         essential-cert-manager-5c5cd999d7-2rnj9                           1/1     Running     0          22h
iks                         essential-cert-manager-cainjector-84bc8567bd-t4npd                1/1     Running     0          22h
iks                         essential-cert-manager-webhook-7dbfb9f587-85f47                   1/1     Running     0          22h
iks                         essential-metallb-controller-798b744d4f-t66tw                     1/1     Running     0          22h
iks                         essential-metallb-speaker-5bdsm                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-98qmp                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-ms6hx                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-nbq89                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-ppz95                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-wgzld                                   1/1     Running     0          22h
iks                         essential-metallb-speaker-zshfz                                   1/1     Running     0          22h
iks                         essential-nginx-ingress-ingress-nginx-controller-7jrsr            1/1     Running     0          22h
iks                         essential-nginx-ingress-ingress-nginx-controller-l69rv            1/1     Running     0          22h
iks                         essential-nginx-ingress-ingress-nginx-controller-mqr7q            1/1     Running     0          22h
iks                         essential-nginx-ingress-ingress-nginx-controller-s4tls            1/1     Running     0          22h
iks                         essential-nginx-ingress-ingress-nginx-defaultbackend-7d98f5xbbf   1/1     Running     0          22h
iks                         essential-registry-docker-registry-75b68947d5-gnb94               1/1     Running     0          22h
iks                         populate-registry-627468e37a6f722d304ce734-l749s                  0/1     Completed   0          22h
istio-system                authservice-0                                                     1/1     Running     0          3h7m
istio-system                cluster-local-gateway-64f58f66cb-ncnkd                            1/1     Running     0          3h7m
istio-system                istio-ingressgateway-8577c57fb6-c8t9p                             1/1     Running     0          3h7m
istio-system                istiod-6c86784695-bvgqs                                           1/1     Running     0          3h7m
knative-eventing            eventing-controller-79895f9c56-2zpmv                              1/1     Running     0          3h7m
knative-eventing            eventing-webhook-78f897666-n5m5q                                  1/1     Running     0          3h7m
knative-eventing            imc-controller-688df5bdb4-66gvz                                   1/1     Running     0          3h7m
knative-eventing            imc-dispatcher-646978d797-2z2b2                                   1/1     Running     0          3h7m
knative-eventing            mt-broker-controller-67c977497-mgtmc                              1/1     Running     0          3h7m
knative-eventing            mt-broker-filter-66d4d77c8b-gjrhc                                 1/1     Running     0          3h7m
knative-eventing            mt-broker-ingress-5c8dc4b5d7-tgh6l                                1/1     Running     0          3h7m
knative-serving             activator-7476cc56d4-lwtqq                                        2/2     Running     2          3h7m
knative-serving             autoscaler-5c648f7465-wzmzl                                       2/2     Running     0          3h7m
knative-serving             controller-57c545cbfb-nnjcm                                       2/2     Running     0          3h6m
knative-serving             istio-webhook-578b6b7654-s445x                                    2/2     Running     0          3h7m
knative-serving             networking-istio-6b88f745c-887mz                                  2/2     Running     0          3h7m
knative-serving             webhook-6fffdc4d78-ml2mn                                          2/2     Running     0          3h7m
kserve                      kserve-controller-manager-0                                       2/2     Running     0          3h7m
kube-system                 calico-kube-controllers-7f6f95d7c9-5gj8d                          1/1     Running     0          22h
kube-system                 calico-node-4x5cz                                                 1/1     Running     0          22h
kube-system                 calico-node-5z2cp                                                 1/1     Running     0          22h
kube-system                 calico-node-cr9p7                                                 1/1     Running     0          22h
kube-system                 calico-node-fh8q9                                                 1/1     Running     0          22h
kube-system                 calico-node-gtmn7                                                 1/1     Running     0          22h
kube-system                 calico-node-kk8kh                                                 1/1     Running     0          22h
kube-system                 calico-node-xvlpr                                                 1/1     Running     0          22h
kube-system                 ccp-vip-manager-kubeflow-demo-controlpl-8df153f1d3                1/1     Running     0          22h
kube-system                 ccp-vip-manager-kubeflow-demo-controlpl-de8b27459d                1/1     Running     0          22h
kube-system                 ccp-vip-manager-kubeflow-demo-controlpl-fd5e754966                1/1     Running     0          22h
kube-system                 coredns-6bf949b6cb-4f7pf                                          1/1     Running     0          22h
kube-system                 coredns-6bf949b6cb-vt958                                          1/1     Running     0          22h
kube-system                 etcd-kubeflow-demo-controlpl-8df153f1d3                           1/1     Running     0          22h
kube-system                 etcd-kubeflow-demo-controlpl-de8b27459d                           1/1     Running     0          22h
kube-system                 etcd-kubeflow-demo-controlpl-fd5e754966                           1/1     Running     0          22h
kube-system                 kube-apiserver-kubeflow-demo-controlpl-8df153f1d3                 1/1     Running     2          22h
kube-system                 kube-apiserver-kubeflow-demo-controlpl-de8b27459d                 1/1     Running     1          22h
kube-system                 kube-apiserver-kubeflow-demo-controlpl-fd5e754966                 1/1     Running     0          22h
kube-system                 kube-controller-manager-kubeflow-demo-controlpl-8df153f1d3        1/1     Running     0          22h
kube-system                 kube-controller-manager-kubeflow-demo-controlpl-de8b27459d        1/1     Running     0          22h
kube-system                 kube-controller-manager-kubeflow-demo-controlpl-fd5e754966        1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-controlpl-8df153f1d3                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-controlpl-de8b27459d                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-controlpl-fd5e754966                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-worker-po-438cf118cd                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-worker-po-6789fafcc8                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-worker-po-8272d641ca                     1/1     Running     0          22h
kube-system                 kube-proxy-kubeflow-demo-worker-po-bee059c8f5                     1/1     Running     0          22h
kube-system                 kube-scheduler-kubeflow-demo-controlpl-8df153f1d3                 1/1     Running     0          22h
kube-system                 kube-scheduler-kubeflow-demo-controlpl-de8b27459d                 1/1     Running     0          22h
kube-system                 kube-scheduler-kubeflow-demo-controlpl-fd5e754966                 1/1     Running     0          22h
kube-system                 vsphere-cpi-8756g                                                 1/1     Running     0          22h
kube-system                 vsphere-cpi-qnwrz                                                 1/1     Running     0          22h
kube-system                 vsphere-cpi-xsdwb                                                 1/1     Running     0          22h
kube-system                 vsphere-csi-controller-7c68bf98cc-gbfr7                           5/5     Running     0          22h
kube-system                 vsphere-csi-node-5d282                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-6z47f                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-bmbr2                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-l82hj                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-m29z4                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-ppmf8                                            3/3     Running     0          22h
kube-system                 vsphere-csi-node-vqfwg                                            3/3     Running     0          22h
kubeflow-user-example-com   ml-pipeline-ui-artifact-d57bd98d7-s84t4                           2/2     Running     0          174m
kubeflow-user-example-com   ml-pipeline-visualizationserver-65f5bfb4bf-bmtg8                  2/2     Running     0          174m
kubeflow                    admission-webhook-deployment-7df7558c67-d7mfm                     1/1     Running     0          3h7m
kubeflow                    cache-deployer-deployment-6f4bcc969-zh9vx                         2/2     Running     1          3h7m
kubeflow                    cache-server-575d97c95-jc4nw                                      2/2     Running     0          3h7m
kubeflow                    centraldashboard-79f489b55-cr7hn                                  2/2     Running     0          3h7m
kubeflow                    jupyter-web-app-deployment-5886974887-m96wv                       1/1     Running     0          3h7m
kubeflow                    katib-controller-58ddb4b856-9zjtj                                 1/1     Running     0          3h7m
kubeflow                    katib-db-manager-d77c6757f-jt9b6                                  1/1     Running     4          3h7m
kubeflow                    katib-mysql-7894994f88-zzwrz                                      1/1     Running     0          3h7m
kubeflow                    katib-ui-f787b9d88-cwg9l                                          1/1     Running     0          3h7m
kubeflow                    kfserving-controller-manager-0                                    2/2     Running     0          3h6m
kubeflow                    kfserving-models-web-app-7884f597cf-8vg4b                         2/2     Running     0          3h7m
kubeflow                    kserve-models-web-app-5c64c8d8bb-sqtzs                            2/2     Running     0          3h7m
kubeflow                    kubeflow-pipelines-profile-controller-84bcbdb899-rddgd            1/1     Running     0          3h7m
kubeflow                    metacontroller-0                                                  1/1     Running     0          3h6m
kubeflow                    metadata-envoy-deployment-7b847ff6c5-cqvkw                        1/1     Running     0          3h7m
kubeflow                    metadata-grpc-deployment-f8d68f687-kqlgq                          2/2     Running     4          3h7m
kubeflow                    metadata-writer-78fc7d5bb8-t5xp7                                  2/2     Running     0          3h7m
kubeflow                    minio-5b65df66c9-sx8kb                                            2/2     Running     0          3h7m
kubeflow                    ml-pipeline-7bb5966955-87jbv                                      2/2     Running     6          3h7m
kubeflow                    ml-pipeline-persistenceagent-87b6888c4-n9tgd                      2/2     Running     0          3h7m
kubeflow                    ml-pipeline-scheduledworkflow-665847bb9-2mpz6                     2/2     Running     0          3h7m
kubeflow                    ml-pipeline-ui-554ffbd6cd-8sswm                                   2/2     Running     0          3h7m
kubeflow                    ml-pipeline-viewer-crd-68777557fb-k65lr                           2/2     Running     1          3h7m
kubeflow                    ml-pipeline-visualizationserver-66c54744c-cp2np                   2/2     Running     0          3h7m
kubeflow                    mysql-f7b9b7dd4-56gjd                                             2/2     Running     0          3h7m
kubeflow                    notebook-controller-deployment-7474fbff66-26fzm                   2/2     Running     1          3h7m
kubeflow                    profiles-deployment-5cc86bc965-vjfv6                              3/3     Running     1          3h7m
kubeflow                    tensorboard-controller-controller-manager-5cbddb7fb5-cglzr        3/3     Running     1          3h7m
kubeflow                    tensorboards-web-app-deployment-7c5db448d7-84pjw                  1/1     Running     0          3h7m
kubeflow                    training-operator-6bfc7b8d86-l59l8                                1/1     Running     0          3h7m
kubeflow                    volumes-web-app-deployment-87484c848-rl4rl                        1/1     Running     0          3h7m
kubeflow                    workflow-controller-5cb67bb9db-7bfqc                              2/2     Running     2          3h7m
```

## 3. Access the Kubeflow Central Dashboard

Once you have everything deployed, you can do a port-forward with

```
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
```

and access the Kubeflow Central Dashboard remotely at [http://localhost:8080](http://localhost:8080).

![](images/kf_central_dashboard.png)

## 4. Setup Jupyter Notebooks

### Allow access to Kubeflow Pipelines from Jupyter Notebooks

In this demo you will access the Kubeflow Pipeline via the Python SDK in a Jupyter notebook. Therefore, one additional setting is required to allow this.

At first insert your Kubeflow username in this Kubernetes manifest (your Kubeflow username is also the name of a Kubernetes namespace where all your user-specific containers will be spun up): [kubeflow_config/access_kfp_from_jupyter_notebook.yaml](kubeflow_config/access_kfp_from_jupyter_notebook.yaml). You can the exact namespace name under the **Manage Contributers** menu.

Once done, apply it with this command:

```
kubectl apply -f access_kfp_from_jupyter_notebook.yaml
```

### Spinning up a new Notebook Instance

Now, you need to spin a up new Jupyter notebook instance. For the container image select **jupyter-tensorflow-full:v1.5.0**. This can take several minutes depending on your download speed.

![](images/kf_notebook.png)

Don't forget to enable this configuration:

![](images/kf_kfp_config.png)

### Cloning the code from Github & exploring the dataset

With Juypter Lab you have access to a terminal and Python notebook in your web browser. This is where your data science team and you can collaborate on exploring that dataset and also create your Kubeflow Pipeline.

At first, let's clone this repository so you have access to the code. You can use the terminal or directly do that in the browser.

```
git clone https://github.com/flopach/digits-recognizer-kubeflow-intersight
```

![](images/kf_clone_notebook.png)

Then open `digits_recognizer_explore.` to get a feeling of the [dataset](http://yann.lecun.com/exdb/mnist/) and its format.

## Setup MinIO for object storage

In order to provide a single source of truth where all your working data (training and testing data, saved ML models etc.) is available to all your components, using an object storage is a recommended way. For our app, we will setup [MinIO](https://min.io).

Since Kubeflow has already setup a MinIO tenant, we will leverage the **mlpipeline bucket**. But you can also deploy your own MinIO tenant.

### Get credentials from Kubeflow's integrated MinIO

1. Obtain the accesskey and secretkey for MinIO with these commands:

```
kubectl get secret mlpipeline-minio-artifact -n kubeflow -o jsonpath="{.data.accesskey}" | base64 --decode
```

```
kubectl get secret mlpipeline-minio-artifact -n kubeflow -o jsonpath="{.data.secretkey}" | base64 --decode
```

2. In order to get access to MinIO from outside of your Kubernetes cluster and check the bucket, do a port-forward:

```
kubectl port-forward -n kubeflow svc/minio-service 9000:9000
```

3. Then you can access the MinIO dashboard at [http://localhost:9000](http://localhost:9000) and check the bucket name or create your own bucket. Alternatively, you can use the [MinIO CLI Client](https://docs.min.io/docs/minio-client-quickstart-guide.html)

**Default** values should be (already in the code and no action on your end):

* accesskey: **minio**
* secretkey: **minio123**
* bucket: **mlpipeline**

## Get started with Kubeflow Pipelines

Kubeflow Pipelines (KFP) is the most used component of Kubeflow. It allows you to create for every step or function in your ML project a reusable containerized pipeline component which can be chained together as a ML pipeline.

For the digits recognizer application, the pipeline is already created with the Python SDK. You can find the code in the file `digits_recognizer_pipeline.ipynb`

1. Got to **Notebooks** and click on **CONNECT** to start the Jupyter Notebook container.
2. Upload the Notebook File directly in the browser to access it.
3. Also, double check if the correct version of the Kubeflow python packages are installed:

`pip list`

```
kfp                      1.6.3
kfp-pipeline-spec        0.1.13
kfp-server-api           1.6.0
```

## Creating the digits recognizer web application

You can find the digits recognizer app in the folder `web_app`.


## Serving the ML model with Kserve

`kubectl -n knative-serving edit configmap config-deployment`

Change to:

```
apiVersion: v1
data:
  registriesSkippingTagResolving: "index.docker.io"
  _example: |
    ################################
    #                              #
    #    EXAMPLE CONFIGURATION     #
    #                              #
    ################################
```

Find more here: https://kserve.github.io/website/developer/debug/#inference-service-fails-to-start 

_work in progress_



