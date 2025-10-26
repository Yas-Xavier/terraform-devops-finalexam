pipeline {
    agent any

    environment {
        // Your SSH key credential stored in Jenkins
        //SSH_KEY = credentials('ssh-production-key')
        
        TESTING_SERVER     = "13.217.99.72"
        STAGING_SERVER     = "3.95.209.185"
        PRODUCTION_SERVER1 = "34.224.33.7"
        PRODUCTION_SERVER2 = "13.217.84.196"
      
        // GitHub repo for Tic Tac Toe
        REPO_URL = "https://github.com/Yas-Xavier/terraform-devops-finalexam/tree/main/tic-tac-toe"

        // Selenium test file
        SELENIUM_SCRIPT = "https://github.com/Yas-Xavier/terraform-devops-finalexam/tree/main/tic-tac-toe/selenium_test.js"

        // Temp file to store test results
        TEST_RESULT_FILE = "test_result.txt"
    }

    stages {

        stage('Deploy to Testing') {
            steps {
                echo "Deploying Tic-Tac-Toe app to Testing Environment..."
                script {
                    sh '''
                    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@$TESTING_SERVER '
                        sudo rm -rf /var/www/html/*
                        sudo dnf update -y
                        sudo dnf install -y git httpd
                        sudo systemctl enable httpd
                        sudo systemctl start httpd
                        sudo git clone '"$REPO_URL"' /var/www/html
                        sudo chown -R apache:apache /var/www/html
                    '
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo "Running Selenium tests in Testing Environment..."
                script {
                    try {
                        sh '''
                        node $SELENIUM_SCRIPT
                        echo "true" > $TEST_RESULT_FILE
                        '''
                        echo "Selenium tests passed."
                    } catch (Exception e) {
                        sh 'echo "false" > $TEST_RESULT_FILE'
                        echo "Selenium tests failed."
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression {
                    return fileExists(env.TEST_RESULT_FILE) && readFile(env.TEST_RESULT_FILE).trim() == "true"
                }
            }
            steps {
                echo "🚀 Deploying to Staging Environment..."
                script {
                    sh '''
                    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@$STAGING_SERVER '
                        sudo rm -rf /var/www/html/*
                        sudo dnf update -y
                        sudo dnf install -y git httpd
                        sudo systemctl enable httpd
                        sudo systemctl start httpd
                        sudo git clone '"$REPO_URL"' /var/www/html
                        sudo chown -R apache:apache /var/www/html
                    '
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    return fileExists(env.TEST_RESULT_FILE) && readFile(env.TEST_RESULT_FILE).trim() == "true"
                }
            }
            steps {
                echo "Deploying to both Production servers..."
                script {
                    def servers = [env.PRODUCTION_SERVER1, env.PRODUCTION_SERVER2]
                    for (server in servers) {
                        sh """
                        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ec2-user@${server} '
                            sudo rm -rf /var/www/html/*
                            sudo dnf update -y
                            sudo dnf install -y git httpd
                            sudo systemctl enable httpd
                            sudo systemctl start httpd
                            sudo git clone ${REPO_URL} /var/www/html
                            sudo chown -R apache:apache /var/www/html
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up temporary files..."
            sh "rm -f ${TEST_RESULT_FILE}"
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check console output for details."
        }
    }
}
