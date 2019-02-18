/**
 * 
 * Drop all tables in the schema
 */
DROP SCHEMA if exists "ProjectSample" CASCADE;
create schema "ProjectSample";

CREATE TABLE "ProjectSample".Users(
    email varchar(50) PRIMARY KEY,
    password varchar(50),
    username varchar(50),
    accountType varchar(50) NOT null,
    Check(accountType = 'Customer' OR accountType ='Manager')
);

CREATE TABLE "ProjectSample".FoodType(
    restaurantType varchar(50) PRIMARY KEY
);

CREATE TABLE "ProjectSample".Area(
    area VARCHAR(50) PRIMARY KEY  
);

CREATE TABLE "ProjectSample".Address(
    postalCode CHAR(6) PRIMARY KEY,
    area VARCHAR(50),
    fullAddress text unique,
    FOREIGN KEY (area) REFERENCES "ProjectSample".Area     
);




CREATE TABLE "ProjectSample".Customer(
    email varchar(50) PRIMARY KEY,
    password varchar(50),
    username varchar(50),
    points INT default 0,
    accountType varchar(50) NOT null default 'Customer',
    FOREIGN KEY (email) REFERENCES "ProjectSample".Users (email),
    Check(accountType = 'Customer')
);


CREATE TABLE "ProjectSample".Redeem(
	redeemId INT primary key,
    description varchar(50) not null,
    email varchar(50) not null,
    FOREIGN KEY (email) REFERENCES "ProjectSample".Customer
);


CREATE TABLE "ProjectSample".Manager(
    email varchar(50) PRIMARY KEY,
    password varchar(50),
    username varchar(50),
    accountType varchar(50) NOT null default 'Manager',
    FOREIGN KEY (email) REFERENCES "ProjectSample".Users (email),
    Check(accountType = 'Manager')
);


CREATE TABLE "ProjectSample".Restaurant (
	restaurantName varchar(50) PRIMARY KEY,
    avgRating numeric(2,1) NOT NULL default 0.0,
    openingHour VARCHAR(50) NOT null,
    restaurantType VARCHAR(50) not null,
    check(avgRating >= 0.0 and avgRating <= 5.0),  
   	FOREIGN KEY (restaurantType) REFERENCES "ProjectSample".FoodType ON DELETE CASCADE     
);

CREATE TABLE "ProjectSample".Branch(
	branchId INT,
	restaurantName varchar(50),
	postalCode CHAR(6),
	PRIMARY KEY (branchId, restaurantName),
	FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE cascade,  
	FOREIGN KEY (postalCode) REFERENCES "ProjectSample".Address
);

CREATE TABLE "ProjectSample".Tables(
    tableId INT,
    capacity INT,
    status INT,
    branchId INT,
    restaurantName varchar(50),
    PRIMARY KEY (tableId, branchId, restaurantName),
    FOREIGN KEY (branchId, restaurantName) REFERENCES "ProjectSample".Branch ON DELETE CASCADE,
    FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE CASCADE
);


CREATE TABLE "ProjectSample".Ratings(
    ratingId INT,
    rating numeric(2,1),
    restaurantName varchar(50),
	PRIMARY KEY (ratingId, restaurantName),
    FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE cascade,
    check(rating >= 0.0 and rating <= 5.0)
);

CREATE TABLE "ProjectSample".Meals(
    mealName varchar(50),
    price NUMERIC(7,2),
    restaurantName varchar(50),
	PRIMARY KEY (mealName, restaurantName),
    FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE CASCADE
);




CREATE TABLE "ProjectSample".Reservation(
    reservationId INT,
    startTime time,
    endTime time,
    reservedDate date,
    status INT,
    people INT,
    email VARCHAR(50),
    tableId INT,
    branchId INT,
    restaurantName varchar(50),
    PRIMARY KEY (reservationId,email,tableId, branchId, restaurantName),
    FOREIGN KEY (tableId,branchId, restaurantName) REFERENCES "ProjectSample".Tables ON DELETE CASCADE,
    FOREIGN KEY (branchId, restaurantName) REFERENCES "ProjectSample".Branch ON DELETE CASCADE,
    FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE CASCADE,
    FOREIGN KEY (email) REFERENCES "ProjectSample".Customer ON DELETE CASCADE
);


/*
 * Drop triggers before run this script
 * */

DROP TRIGGER IF EXISTS UserInsertTrigger ON "ProjectSample".users;


/*Create Trigger: When a user Insert into User table, then insert into Customer or Manager */
CREATE OR REPLACE FUNCTION updateUser()
  RETURNS trigger AS
$$
BEGIN
if new.accountType = 'Customer' then
		 INSERT INTO "ProjectSample".customer(email,password,username)
		 VALUES(new.email,new.password,new.username);
	else if new.accountType = 'Manager' then
	  	INSERT INTO "ProjectSample".manager(email,password,username)
 		VALUES(new.email,new.password,new.username);
 	end if;
 end if;
 
 RETURN new;
end;
$$
LANGUAGE 'plpgsql';


CREATE TRIGGER UserInsertTrigger
  After insert
  ON "ProjectSample".users
  FOR EACH ROW
  EXECUTE PROCEDURE updateUser();

/***
 * Insert Customer into User table
 */
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c1@gmail.com','123','Yannis Grant','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c2@gmail.com','123','Caitlyn Kent','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c3@gmail.com','123','Tarun Zimmerman','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c4@gmail.com','123','Stewart Montoya','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c5@gmail.com','123','Uwais Harrington','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c6@gmail.com','123','Steve Rollins','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c7@gmail.com','123','Josh Pearson','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c8@gmail.com','123','Xena Everett','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c9@gmail.com','123','Gregory Guy','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c10@gmail.com','123','Emma-Louise Gibson','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c11@gmail.com','123','Derek Hartley','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c12@gmail.com','123','Connah Odonnell','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c13@gmail.com','123','Andy Spooner','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c14@gmail.com','123','Annabelle Blackwell','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c15@gmail.com','123','Vivienne Ferreira','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c16@gmail.com','123','Stefan Foster','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c17@gmail.com','123','Roksana Trevino','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c18@gmail.com','123','Haidar Rivers','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c19@gmail.com','123','Cole Wallace','Customer');
Insert into "ProjectSample".Users (email,password,username,accountType) VALUES('c20@gmail.com','123','Marianna Thatcher','Customer');


/***
 * Insert Manager into User Table
 */
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m1@gmail.com','123','Avneet Ramsay','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m2@gmail.com','123','Ayva Dennis','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m3@gmail.com','123','Samanta Brewer','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m4@gmail.com','123','Preston Kennedy','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m5@gmail.com','123','Maxwell Hardin','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m6@gmail.com','123','Mysha Roth','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m7@gmail.com','123','Viktoria Sullivan','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m8@gmail.com','123','Sonny Sadler','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m9@gmail.com','123','Safia Ramirez','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m10@gmail.com','123','Melisa Brennan','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m11@gmail.com','123','Benny Walker','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m12@gmail.com','123','Terry Foster','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m13@gmail.com','123','Ianis Salt','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m14@gmail.com','123','Onur Cole','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m15@gmail.com','123','Ziggy Reyna','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m16@gmail.com','123','Ciaron Mcculloch','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m17@gmail.com','123','Madeleine Dawson','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m18@gmail.com','123','Omar Walters','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m19@gmail.com','123','Luciano Ritter','Manager');
Insert into "ProjectSample".Users(email,password,username,accountType) VALUES('m20@gmail.com','123','Suleman Mckay','Manager');



Insert into "ProjectSample".foodType(restaurantType) VALUES('Fast Food');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Buffet');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Café');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Vegeterian');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Juice Bar');

select * from "ProjectSample".users;
select * from "ProjectSample".customer;
select * from "ProjectSample".manager;
select * from "ProjectSample".foodType;


