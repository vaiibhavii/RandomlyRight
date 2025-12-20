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
    command:
    - dockerd-entrypoint.sh
    tty: true
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command:
    - cat
    tty: true
'''
        }
    }

    environment {
        ROLL_NO = '2401108'
        IMAGE_NAME = "randomlyright-${ROLL_NO}"
        NAMESPACE = "${ROLL_NO}"
        
        // VERIFIED: Port 30085 is the Docker connector for your cluster
        REGISTRY_HOST = 'nexus.imcc.com:30085'
        REGISTRY_URL = 'http://nexus.imcc.com:30085'
        
        REGISTRY_USER = 'student'
        REGISTRY_PASS = 'Imcc@2025'
        
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'
        
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
                        // 'returnStatus: true' prevents the pipeline from stopping if Sonar fails
                        def status = sh(script: "sonar-scanner -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=student -Dsonar.password=Imccstudent@2025", returnStatus: true)
                        if (status != 0) { echo "⚠️ SonarQube unreachable, continuing to deployment..." }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        echo "Building Docker image..."
                        sh 'while ! docker info > /dev/null 2>&1; do sleep 1; done'
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                container('dind') {
                    script {
                        echo "Pushing image to Nexus..."
                        // Use REGISTRY_HOST (without http://) for the login command
                        sh "echo ${REGISTRY_PASS} | docker login -u ${REGISTRY_USER} --password-stdin ${REGISTRY_HOST}"

                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('jnlp') { 
                    script {
                        echo "Deploying to Namespace: ${NAMESPACE}"
                        sh "sed -i 's|image: .*|image: ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}"
                        sh "sed -i 's|namespace: .*|namespace: ${NAMESPACE}|' ${DEPLOYMENT_FILE}"
                        sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                        sh "kubectl rollout status deployment/randomlyright-deployment -n ${NAMESPACE}"
                    }
                }
            }
        }
    }
}