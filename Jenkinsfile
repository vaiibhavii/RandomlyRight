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
        // --- CONFIGURATION SECTION ---
        ROLL_NO = '2401108'
        IMAGE_NAME = "randomlyright-${ROLL_NO}"
        NAMESPACE = "${ROLL_NO}"
        
        REGISTRY_HOST = 'nexus.imcc.com'
        REGISTRY_URL = 'http://nexus.imcc.com'
        REGISTRY_CREDENTIALS_ID = 'student'
        
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'
        
        IMAGE_TAG = "${BUILD_NUMBER}"
        DEPLOYMENT_FILE = 'k8s/deployment.yaml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                container('sonar') {
                    script {
                        echo "Starting Code Quality Analysis..."
                        withCredentials([usernamePassword(credentialsId: 'student', passwordVariable: 'SONAR_PASSWORD', usernameVariable: 'SONAR_LOGIN')]) {
                            sh """
                                sonar-scanner \
                                -Dsonar.projectKey=randomlyright-${ROLL_NO} \
                                -Dsonar.sources=project-code/src \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=student \
                                -Dsonar.password=Imccstudent@2025
                            """
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        echo "Building Docker image..."
                        // Wait for Docker to be ready
                        sh 'while ! docker info > /dev/null 2>&1; do echo "Waiting for Docker..."; sleep 1; done'
                        
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
                        // Login manually since 'docker.withRegistry' might fail in dind without plugin config
                        withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS_ID}", passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh "echo \$PASS | docker login -u \$USER --password-stdin ${REGISTRY_URL}"
                        }

                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                        
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('jnlp') { // Use the main agent for kubectl (usually pre-installed or mounted)
                    script {
                        echo "Deploying to Namespace: ${NAMESPACE}"
                        
                        sh "sed -i 's|image: .*|image: ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}"
                        sh "sed -i 's|namespace: .*|namespace: ${NAMESPACE}|' ${DEPLOYMENT_FILE}"

                        // Try to use kubectl. If missing in JNLP, we might need another container, 
                        // but standard college setups usually have kubectl in the base agent.
                        sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                        sh "kubectl rollout status deployment/randomlyright-deployment -n ${NAMESPACE}"
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline Failed. Please check logs."
        }
    }
}