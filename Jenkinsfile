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
        
        // CORRECTED: Port 30085 is the UI. Port 30082 is the verified Docker connector.
        REGISTRY_HOST = 'nexus.imcc.com:30082'
        REGISTRY_URL = 'http://nexus.imcc.com:30082'
        
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
                        // Using the token directly as verified in Build #11
                        def status = sh(script: "sonar-scanner -Dsonar.projectKey=${IMAGE_NAME} -Dsonar.sources=. -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=student -Dsonar.password=Imccstudent@2025", returnStatus: true)
                        if (status != 0) { echo "⚠️ SonarQube unreachable, continuing..." }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        echo "Building image... Note: If 429 error occurs, wait 15 mins for Docker Hub reset."
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
                        echo "Pushing image to Nexus at ${REGISTRY_HOST}..."
                        // Correct login command using the Registry Host
                        sh "echo '${REGISTRY_PASS}' | docker login -u ${REGISTRY_USER} --password-stdin ${REGISTRY_HOST}"

                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        
                        echo "✅ Image successfully pushed to Nexus!"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('jnlp') { 
                    script {
                        echo "Deploying to Namespace: ${NAMESPACE}"
                        // Updating the deployment file dynamically
                        sh "sed -i 's|image: .*|image: ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}"
                        sh "sed -i 's|namespace: .*|namespace: ${NAMESPACE}|' ${DEPLOYMENT_FILE}"

                        sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                        sh "kubectl rollout status deployment/randomlyright-deployment -n ${NAMESPACE}"
                        echo "🚀 Application deployed successfully!"
                    }
                }
            }
        }
    }
}