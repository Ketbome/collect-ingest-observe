# Define variables
INTERVAL ?= 0.1 # Default interval if not specified
PID_FILE := .curl_random_pid  # File to store the process ID of the background task

# Array of endpoints (as individual strings for random selection)
ENDPOINTS := "localhost:9999/" "localhost:9999/error" "localhost:9999/users" "localhost:9999/orders" "localhost:9999/users/1/orders" "localhost:9999/users/2/orders" "localhost:9999/users/3/orders" "localhost:9999/users/4/orders" "localhost:9999/users/5/orders" "localhost:9999/users/6/orders" "localhost:9999/users/7/orders" "localhost:9999/users/8/orders" "localhost:9999/users/9/orders" "localhost:9999/users/10/orders"

# Run random curl requests
run:
	@echo "Starting random curl requests every $(INTERVAL) seconds..."
	@bash -c 'while true; do \
		endpoint=$$(shuf -e $(ENDPOINTS) -n 1); \
		curl -s -o /dev/null "$$endpoint"; \
		sleep $(INTERVAL); \
	done' &> /dev/null & echo $$! > $(PID_FILE)

# Stop the random curl requests
stop:
	@if [ -f $(PID_FILE) ]; then \
		echo "Stopping random curl requests..."; \
		kill $$(cat $(PID_FILE)) && rm -f $(PID_FILE); \
	else \
		echo "No running process found."; \
	fi
