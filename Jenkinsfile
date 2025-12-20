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
    # This mount is the secret to fixing the "HTTPS" error
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command:
    - cat
    tty: true
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
'''
        }
    }

    environment {
        ROLL_NO = '2401108'
        IMAGE_NAME = "randomlyright-${ROLL_NO}"
        NAMESPACE = "${ROLL_NO}"
        
        // Use the successful internal service name from the reference repo
        REGISTRY_HOST = 'nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085'
        REGISTRY_URL = "http://${REGISTRY_HOST}"
        
        REGISTRY_USER = 'student'
        REGISTRY_PASS = 'Imcc@2025'
        
        // Use the internal SonarQube service name
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
                        // Using parameters verified in both repos
                        sh "sonar-scanner -Dsonar.projectKey=${IMAGE_NAME} -Dsonar.sources=. -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=student -Dsonar.password=Imccstudent@2025"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        // Wait for docker daemon as seen in reference repo
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
                        sh "docker login ${REGISTRY_HOST} -u ${REGISTRY_USER} -p ${REGISTRY_PASS}"
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update image in deployment file to use internal NodePort path for the pull
                    sh "sed -i 's|image: .*|image: localhost:30085/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}"
                    sh "sed -i 's|namespace: .*|namespace: ${NAMESPACE}|' ${DEPLOYMENT_FILE}"
                    sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                }
            }
        }
    }
}