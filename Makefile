DC := docker compose
API_CONTAINER := track-learn-api-1
DB_CONTAINER := track-learn-db-1

.PHONY: build up down restart migrate setup-admin bash-api clean

# ----------- 🐋 Docker Commands 🐋 ----------- #

build:
    $(DC) build --no-cache
    $(DC) up -d


up:
    $(DC) up -d


down:
    $(DC) down


restart:
    $(DC) restart


clean:
    $(DC) down -v
	docker volume prune -f
	docker container prune -f
    docker system prune -f

# ----------- 📁 API Commands 📁 ----------- #

bash-api:
    docker exec -it $(API_CONTAINER) bash

migrate:
    docker exec -it $(API_CONTAINER) php bin/console doctrine:migrations:migrate

# ----------- 📚 BD Commands 📚 ----------- #

bash-db:
    docker exec -it $(DB_CONTAINER) bash

# Insert admin user
setup-admin:
    docker exec -it $(DB_CONTAINER) mysql -uroot track_learn_db -e "INSERT INTO user VALUES ('9e847ef7-f4cd-48a4-aef4-e1229bfcfc50', 'Administrator', 'admin', 'admin@mail.com', '$2y$13$eMgqXlQEKRB.Z2jHump6pOSu8AZTTcQVckKbwkECa9.nu2bBqqRUa', 'admin', CURRENT_TIMESTAMP(), null);"

# ----------- ⌨️ Initial setup ⌨️ ----------- #

# Full setup: build, migrate, and setup admin
setup: build migrate setup-admin
    @echo "Setup completed successfully!"