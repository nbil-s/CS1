CREATE USER "App-server"@"localhost" IDENTIFIED BY "Queue-Management-App";
GRANT ALL PRIVILEGES ON *.* TO "App-server"@"localhost";

CREATE DATABASE Queue-App;

DROP TABLE IF EXISTS `Queue_Management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Details` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `Name` varchar(50) NOT NULL,
//   `gender` char(1) NOT NULL,
    'name' VARCHAR(100) NOT NULL,
    'phone_number' VARCHAR(20),
    'email' VARCHAR(100) NOT NULL UNIQUE,
    'password' VARCHAR(255) NOT NULL,
    'dob' DATE,
    `day` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


