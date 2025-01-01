# Base image
FROM dasiloy/docker-jobber-server:latest

# Command to run the application
CMD ["npm", "run", "start:prod"]
