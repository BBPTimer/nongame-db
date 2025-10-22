# All OS
## Prerequisites
* Download and install [Node.js](https://nodejs.org/en/download)
* Download and install [Java JRE 21](https://adoptium.net/temurin/releases/?arch=any&version=21&os=any)
* Download and install [MySQL Server](https://dev.mysql.com/downloads/mysql)
	* During installation, make note of the following:
		* root user password
		* MySQL installation path

| OS      | Default Installation Path      |
| ------- | ------------------------------ |
| macOS   | `/usr/local/mysql`             |
| Windows | `C:\Program Files\MySQL\MySQL` |

## Clone repository
* Open a terminal and paste:
	* `git clone https://github.com/BBPTimer/nongame-db`
# macOS / Linux
## Backend
* In your terminal, paste:
	`bash ./nongame-db/deploy/backend.sh`
* When prompted, paste in your MySQL installation path and root user password
	* This script will:
		1. Create SQL database to support the backend
		2. Create admin user to connect to the database
		3. Execute the backend JAR file
## Frontend
* **Leave the first terminal running**, open a **second** terminal, and paste:
	`bash ./nongame-db/deploy/frontend.sh`
* This script will:
		1. Install necessary packages
		2. Run the frontend
# Windows / Manual deployment
## Database creation script
* Copy the **full file path** of **create.sql** found in the **deploy** folder of the cloned repo
* Open a terminal, navigate to the **bin** folder within your MySQL installation path, and paste:
	`mysql -u root -p < <CREATE.SQL PATH>
* When prompted, paste in your root user password
	* This script will:
		1. Create SQL database to support the backend
		2. Create admin user to connect to the database
## Run backend JAR file
* Copy the **full file path** of **backend.jar** found in the **deploy** folder of the cloned repo
* In your terminal, navigate to your Java installation folder, and paste:
	`java -jar <BACKEND.JAR PATH>`
## Frontend
* **Leave the first terminal running**, open a **second** terminal, navigate to the **frontend** folder of the repo, and paste:
	`npm install`
	`npm run dev`
# All OS
## Play!
* **Leave the second terminal running** and visit http://localhost:5173 in your browser to play!