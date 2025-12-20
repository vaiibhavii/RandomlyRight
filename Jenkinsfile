pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins-agent
spec:
  hostAliases:
  - ip: "192.168.20.250"
    hostnames:
    - "nexus.imcc.com"
    - "sonarqube.imcc.com"
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    command:
    - dockerd-entrypoint.sh
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
'''
        }
    }

    environment {
        ROLL_NO = '2401108'
        IMAGE_NAME = "my-repository/randomlyright-${ROLL_NO}"
        SONAR_PROJECT_KEY = "randomlyright-${ROLL_NO}"
        NAMESPACE = "${ROLL_NO}"
        
        REGISTRY_HOST = 'nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085'
        REGISTRY_URL = "http://${REGISTRY_HOST}"
        
        REGISTRY_USER = 'student'
        REGISTRY_PASS = 'Imcc@2025'
        
        SONAR_HOST_URL = 'http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000'
        
        IMAGE_TAG = "${BUILD_NUMBER}"
        DEPLOYMENT_FILE = 'k8s/deployment.yaml'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('SonarQube Analysis') {
            steps {
                container('sonar') { 
                    script {
                        echo "Starting Code Quality Analysis..."
                        // ADDED: Exclusions from Stalum to make analysis cleaner
                        sh """
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=student \
                            -Dsonar.password=Imccstudent@2025 \
                            -Dsonar.exclusions=**/node_modules/**,**/build/**,**/*.test.js
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        sh 'timeout=60; while ! docker info > /dev/null 2>&1; do echo "Waiting..."; sleep 1; done'
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                container('dind') {
                    script {
                        echo "Pushing to Nexus..."
                        sh "docker login ${REGISTRY_HOST} -u ${REGISTRY_USER} -p ${REGISTRY_PASS}"
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') { 
                    script {
                        echo "Deploying to Namespace: ${NAMESPACE}"
                        sh """
                            # 1. Ensure Namespace exists
                            kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

                            # 2. ADDED: Force delete old deployment to clear stuck pods (from Stalum reference)
                            kubectl delete deployment randomlyright-deployment -n ${NAMESPACE} --ignore-not-found=true

                            # 3. Update YAML with Image and Namespace
                            sed -i 's|image: .*|image: localhost:30085/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}
                            sed -i 's|namespace: .*|namespace: \"${NAMESPACE}\"|' ${DEPLOYMENT_FILE}

                            # 4. Apply all manifests from the k8s folder
                            kubectl apply -f k8s/ -n ${NAMESPACE}

                            # 5. ENHANCED: Rollout verification with Fail-Safe Diagnostics (from Stalum reference)
                            if ! kubectl rollout status deployment/randomlyright-deployment -n ${NAMESPACE} --timeout=5m; then
                                echo "❌ Rollout FAILED. Collecting Debug Information..."
                                kubectl get pods -n ${NAMESPACE} -o wide
                                kubectl describe pods -n ${NAMESPACE}
                                exit 1
                            fi
                            
                            echo "🚀 100% SUCCESSFUL DEPLOYMENT"
                        """
                    }
                }
            }
        }
    }
}