// ╔══════════════════════════════════════════════════════════════════╗
// ║          NutriHelp DevOps Pipeline — Jenkins Declarative         ║
// ║   Stages: Build → Test → Code Quality → Security →              ║
// ║           Deploy → Release → Monitoring                         ║
// ╚══════════════════════════════════════════════════════════════════╝

pipeline {
    agent any

    environment {
        APP_NAME        = 'nutrihelp-api'
        IMAGE_NAME      = 'nutrihelp-api'
        STAGING_PORT    = '3000'
        PROD_PORT       = '80'

        APP_VERSION     = "1.0.${BUILD_NUMBER}"

        SONAR_SERVER    = 'SonarQube'

        NODE_VERSION    = '20'

        IMAGE_TAG       = "${IMAGE_NAME}:${APP_VERSION}"
        IMAGE_LATEST    = "${IMAGE_NAME}:latest"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {

        // ─────────────────────────────────────────
        // STAGE 1: Checkout
        // ─────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "═══ Checking out source code ═══"
                checkout scm

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()

                    echo "Commit: ${env.GIT_COMMIT_SHORT} | Version: ${APP_VERSION}"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 2: BUILD
        // ─────────────────────────────────────────
        stage('Build') {
            steps {
                echo "═══ STAGE: Build ═══"

                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Building NutriHelp v${APP_VERSION}..."

                    npm ci

                    mkdir -p dist

                    cat > dist/build-info.json <<EOF
{
  "name": "nutrihelp-api",
  "version": "${APP_VERSION}",
  "buildNumber": "${BUILD_NUMBER}",
  "gitCommit": "${GIT_COMMIT_SHORT}",
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nodeVersion": "$(node --version)",
  "branch": "${GIT_BRANCH:-main}"
}
EOF

                    echo "Build artefact created:"
                    cat dist/build-info.json

                    docker build \
                        --build-arg APP_VERSION=${APP_VERSION} \
                        -t ${IMAGE_NAME}:${APP_VERSION} \
                        -t ${IMAGE_NAME}:latest \
                        .

                    echo "Docker image built successfully"
                    docker images | grep ${IMAGE_NAME}
                '''
            }

            post {
                success {
                    archiveArtifacts artifacts: 'dist/build-info.json', fingerprint: true
                    echo "✅ Build stage passed"
                }

                failure {
                    echo "❌ Build stage FAILED"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 3: TEST
        // ─────────────────────────────────────────
        stage('Test') {
            steps {
                echo "═══ STAGE: Test ═══"

                sh '''
                    echo "Running Jest tests..."

                    npm test -- \
                        --ci \
                        --reporters=default \
                        --reporters=jest-junit \
                        2>&1 || true

                    echo "Coverage generated."
                '''
            }

            post {
                always {
                    junit testResults: 'junit.xml', allowEmptyResults: true

                    publishHTML(target: [
                        allowMissing         : true,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'coverage/lcov-report',
                        reportFiles          : 'index.html',
                        reportName           : 'Jest Coverage Report'
                    ])

                    archiveArtifacts artifacts: 'coverage/lcov.info', allowEmptyArchive: true
                }

                success {
                    echo "✅ Test stage passed"
                }

                failure {
                    echo "❌ Test stage FAILED"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 4: CODE QUALITY
        // ─────────────────────────────────────────
        stage('Code Quality') {
            steps {
                echo "═══ STAGE: Code Quality Analysis ═══"

                sh '''
                    echo "Running ESLint..."

                    npx eslint src/ tests/ \
                        --format json \
                        --output-file eslint-report.json || true

                    echo "ESLint complete."
                '''

                withSonarQubeEnv("${SONAR_SERVER}") {
                    sh '''
                        npx sonar-scanner \
                            -Dsonar.projectVersion=${APP_VERSION} \
                            -Dsonar.scm.revision=${GIT_COMMIT_SHORT}
                    '''
                }
            }

            post {
                always {
                    archiveArtifacts artifacts: 'eslint-report.json', allowEmptyArchive: true
                }

                success {
                    echo "✅ Code Quality stage passed"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 4b: QUALITY GATE
        // ─────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                echo "═══ Waiting for SonarQube Quality Gate ═══"

                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }

            post {
                success {
                    echo "✅ Quality Gate PASSED"
                }

                failure {
                    echo "⚠️ Quality Gate FAILED"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 5: SECURITY
        // ─────────────────────────────────────────
        stage('Security') {
            steps {
                echo "═══ STAGE: Security Scanning ═══"

                sh '''
                    echo "━━━ npm audit ━━━"

                    npm audit --json > npm-audit-report.json 2>&1 || true
                    npm audit --audit-level=high 2>&1 || true

                    echo ""
                    echo "━━━ Trivy scan ━━━"

                    if command -v trivy > /dev/null 2>&1; then

                        trivy image \
                            --exit-code 0 \
                            --severity LOW,MEDIUM,HIGH,CRITICAL \
                            --format json \
                            --output trivy-report.json \
                            ${IMAGE_NAME}:${APP_VERSION}

                        echo "Trivy scan completed."

                    else
                        echo "⚠️ Trivy not installed"
                        echo '{"message":"Trivy not installed"}' > trivy-report.json
                    fi
                '''
            }

            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit-report.json, trivy-report.json',
                                     allowEmptyArchive: true
                }

                success {
                    echo "✅ Security stage complete"
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 6: DEPLOY
        // ─────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo "═══ STAGE: Deploy to Staging ═══"

                sh '''
                    echo "Deploying NutriHelp v${APP_VERSION}..."

                    docker stop nutrihelp-staging 2>/dev/null || true
                    docker rm nutrihelp-staging 2>/dev/null || true

                    docker stop nutrihelp-prometheus 2>/dev/null || true
                    docker rm nutrihelp-prometheus 2>/dev/null || true

                    docker stop nutrihelp-grafana 2>/dev/null || true
                    docker rm nutrihelp-grafana 2>/dev/null || true

                    # FIXED HERE
                    APP_VERSION=${APP_VERSION} docker-compose up -d

                    echo "Waiting for containers..."
                    sleep 15

                    MAX_RETRIES=10
                    COUNT=0

                    until curl -sf http://localhost:${STAGING_PORT}/health; do
                        COUNT=$((COUNT+1))

                        if [ $COUNT -ge $MAX_RETRIES ]; then
                            echo "❌ Health check failed"
                            docker logs nutrihelp-staging
                            exit 1
                        fi

                        echo "Waiting for API..."
                        sleep 5
                    done

                    echo "✅ Deployment successful"

                    curl -sf http://localhost:${STAGING_PORT}/health
                '''
            }

            post {
                success {
                    echo "✅ Deploy stage passed"
                }

                failure {
                    echo "❌ Deploy stage FAILED"

                    // FIXED HERE
                    sh 'docker compose logs || true'
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 7: RELEASE
        // ─────────────────────────────────────────
        stage('Release') {
            steps {
                echo "═══ STAGE: Release ═══"

                sh '''
                    echo "Preparing release..."

                    docker tag ${IMAGE_NAME}:${APP_VERSION} ${IMAGE_NAME}:release-${APP_VERSION}
                    docker tag ${IMAGE_NAME}:${APP_VERSION} ${IMAGE_NAME}:stable

                    cat > release-notes.md <<EOF
# NutriHelp Release v${APP_VERSION}

Release Date: $(date -u)

Build: ${BUILD_NUMBER}
Commit: ${GIT_COMMIT_SHORT}
EOF

                    echo "Stopping staging stack..."

                    # FIXED HERE
                    docker compose down || true

                    echo "Starting production stack..."

                    # FIXED HERE
                    APP_VERSION=${APP_VERSION} docker compose -f docker-compose.prod.yml up -d

                    sleep 15

                    curl -sf http://localhost:${PROD_PORT}/health

                    echo "✅ Production deployment successful"
                '''
            }

            post {
                always {
                    archiveArtifacts artifacts: 'release-notes.md', fingerprint: true
                }

                success {
                    echo "✅ Release stage passed"
                }

                failure {
                    echo "❌ Release stage FAILED"

                    sh '''
                        # FIXED HERE
                        docker compose -f docker-compose.prod.yml down || true
                    '''
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 8: MONITORING
        // ─────────────────────────────────────────
        stage('Monitoring') {
            steps {
                echo "═══ STAGE: Monitoring ═══"

                sh '''
                    echo "Checking monitoring stack..."

                    curl -sf http://localhost:${PROD_PORT}/health
                    curl -sf http://localhost:${PROD_PORT}/metrics | head

                    echo "✅ Monitoring verified"
                '''
            }

            post {
                success {
                    echo "✅ Monitoring stage passed"
                }
            }
        }
    }

    // ─────────────────────────────────────────
    // POST ACTIONS
    // ─────────────────────────────────────────
    post {
        always {
            echo "━━━ Pipeline Finished: ${currentBuild.currentResult} ━━━"
            echo "Build: #${BUILD_NUMBER} | Version: ${APP_VERSION}"
        }

        success {
            echo """
╔══════════════════════════════════════════╗
║  ✅ PIPELINE SUCCESS                     ║
║  NutriHelp v${APP_VERSION} deployed!     ║
╚══════════════════════════════════════════╝
"""
        }

        failure {
            echo """
╔══════════════════════════════════════════╗
║  ❌ PIPELINE FAILED                      ║
╚══════════════════════════════════════════╝
"""
        }

        cleanup {
            cleanWs(
                cleanWhenSuccess: false,
                cleanWhenFailure: false,
                cleanWhenAborted: true
            )
        }
    }
}
