pipeline {
    agent any

    environment {
        IMAGE_NAME = 'randomlyright'
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/RandomlyRight.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Run Container (Optional)') {
            steps {
                script {
                    // Stop any existing container
                    sh "docker rm -f ${IMAGE_NAME} || true"
                    // Run new container (expose port 3000 for React dev server)
                    sh "docker run -d -p 3000:3000 --name ${IMAGE_NAME} ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Push to Docker Registry (Optional)') {
            steps {
                script {
                    // Login and push if needed
                    // sh "docker login -u <username> -p <password> <registry>"
                    // sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} <registry>/<username>/${IMAGE_NAME}:${IMAGE_TAG}"
                    // sh "docker push <registry>/<username>/${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo 'Docker build and run successful!'
        }
        failure {
            echo 'Docker build or run failed.'
        }
    }
}
