pipeline {
    agent any

    environment {
        // --- CONFIGURATION SECTION ---
        
        // UNIQUE IDENTITY
        ROLL_NO = '2401108'
        IMAGE_NAME = "randomlyright-${ROLL_NO}"
        NAMESPACE = "${ROLL_NO}"
        
        // REGISTRY DETAILS (Provided by USER)
        REGISTRY_HOST = 'nexus.imcc.com'          // Hostname for tagging (No http://)
        REGISTRY_URL = 'http://nexus.imcc.com'    // URL for login (With http://)
        REGISTRY_CREDENTIALS_ID = 'student'       // Jenkins Credential ID
        
        // SONARQUBE DETAILS (Provided by USER)
        // Note: Full auth is configured in sonar-project.properties
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'
        
        // VERSIONING
        IMAGE_TAG = "${BUILD_NUMBER}"
        DEPLOYMENT_FILE = 'k8s/deployment.yaml'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "Starting Code Quality Analysis..."
                    // Assumes sonar-scanner is available in the Jenkins agent environment
                    // Credentials are read from sonar-project.properties
                    try {
                        sh "sonar-scanner" 
                    } catch (Exception e) {
                        echo "SonarQube analysis failed but continuing pipeline... (Check if scanner is installed)"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                    // Build with local tag first
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo "Pushing image to Nexus Registry..."
                    // Uses the Jenkins Credential ID 'student' for 'http://nexus.imcc.com'
                    docker.withRegistry("${REGISTRY_URL}", "${REGISTRY_CREDENTIALS_ID}") {
                        
                        // Tagging for the private registry
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                        
                        // Pushing
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Namespace: ${NAMESPACE}"
                    
                    // 1. Dynamic Image Update
                    // We must use the full registry path in the YAML
                    sh "sed -i 's|image: .*|image: ${REGISTRY_HOST}/${IMAGE_NAME}:${IMAGE_TAG}|' ${DEPLOYMENT_FILE}"
                    
                    // 2. Enforce Namespace
                    sh "sed -i 's|namespace: .*|namespace: ${NAMESPACE}|' ${DEPLOYMENT_FILE}"

                    // 3. Apply Manifests
                    // Using -n namespace to be doubly sure
                    sh "kubectl apply -f k8s/ -n ${NAMESPACE}"
                    
                    // 4. Verify Rollout
                    sh "kubectl rollout status deployment/randomlyright-deployment -n ${NAMESPACE}"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline Success! URL: http://randomlyright-${ROLL_NO}.local (or configured ingress)"
        }
        failure {
            echo "Pipeline Failed."
        }
    }
}