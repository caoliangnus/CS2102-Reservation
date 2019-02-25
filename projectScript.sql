/**
 * For reservation status -> 1 ongoing, 0 ended
 * 
 */



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
    fullAddress varchar(300) unique,
    FOREIGN KEY (area) REFERENCES "ProjectSample".Area     
);

CREATE TABLE "ProjectSample".Customer(
    email varchar(50) PRIMARY KEY,
    password varchar(50),
    username varchar(50),
    points INT default 0,
    accountType varchar(50) NOT null default 'Customer',
    FOREIGN KEY (email) REFERENCES "ProjectSample".Users (email) on delete cascade,
    Check(accountType = 'Customer')
);


CREATE TABLE "ProjectSample".Redeem(
	redeemId INT primary key,
    description varchar(50) not null,
    email varchar(50) not null,
    FOREIGN KEY (email) REFERENCES "ProjectSample".Customer on delete cascade
);

create table "ProjectSample".Manages(
    email varchar(50) unique not null,
    restaurantName varchar(50) unique not null,
    primary key (email, restaurantName)

);

CREATE TABLE "ProjectSample".Manager(
    email varchar(50) PRIMARY key references "ProjectSample".Manages(email) ,
    password varchar(50),
    username varchar(50),
    accountType varchar(50) NOT null default 'Manager',
    FOREIGN KEY (email) REFERENCES "ProjectSample".Users (email) on delete cascade,
    Check(accountType = 'Manager')
);


CREATE TABLE "ProjectSample".Restaurant (
	restaurantName varchar(50) PRIMARY key,
    avgRating numeric(2,1) NOT NULL default 0.0,
    email varchar(50) unique not null, 
    openingTime TIME NOT null,
    closingTime TIME NOT null,
    restaurantType VARCHAR(50) not null,
    check(avgRating >= 0.0 and avgRating <= 5.0),
    foreign key (email, restaurantName) references "ProjectSample".Manages(email, restaurantName),
   	FOREIGN KEY (restaurantType) REFERENCES "ProjectSample".FoodType ON DELETE CASCADE     
);

CREATE TABLE "ProjectSample".Branch(
	branchId INT,
	restaurantName varchar(50),
	postalCode CHAR(6) unique,
	PRIMARY KEY (branchId, restaurantName),
	FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE cascade,  
	FOREIGN KEY (postalCode) REFERENCES "ProjectSample".Address on update cascade 
);

CREATE TABLE "ProjectSample".Tables(
    tableId INT,
    capacity INT,
    branchId INT,
    restaurantName varchar(50),
    PRIMARY KEY (tableId, branchId, restaurantName),
    FOREIGN KEY (branchId, restaurantName) REFERENCES "ProjectSample".Branch ON DELETE CASCADE,
    FOREIGN KEY (restaurantName) REFERENCES "ProjectSample".Restaurant ON DELETE CASCADE
);


CREATE TABLE "ProjectSample".Ratings(
    ratingId INT,
    rating numeric(2,1) default 0,
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
drop trigger if exists RatingUpdateTrigger on "ProjectSample".Ratings;

  

/*Create Trigger: When a rating is inserted/deleted/updated in the Ratings table, update the avgRating of the restaurant of concern*/
create or replace function updateAvgRating() 
  returns trigger as 
$$
begin
update "ProjectSample".Restaurant
set avgRating = 
(select sum(rating) from "ProjectSample".Ratings where restaurantName = new.restaurantName) 
/ (select count(*) from "ProjectSample".Ratings where restaurantName = new.restaurantName)
where restaurantName = new.restaurantName;

return new;
end;
$$
language 'plpgsql';


create trigger RatingUpdateTrigger
   after insert or delete or update on "ProjectSample".Ratings
   for each row
   execute procedure updateAvgRating();
   
   
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


/**
 * Insert Manager-Restaurant pairs into Manages tables
 * 
 */

insert into "ProjectSample".Manages(email, restaurantName) values ('m1@gmail.com', 'Jumbo Seafood');
insert into "ProjectSample".Manages(email, restaurantName) values ('m2@gmail.com', 'Leon Zicha Store');
insert into "ProjectSample".Manages(email, restaurantName) values ('m3@gmail.com', 'CaoLiang Mala Wok');
insert into "ProjectSample".Manages(email, restaurantName) values ('m4@gmail.com', 'Dehui Coffee Bean');
insert into "ProjectSample".Manages(email, restaurantName) values ('m5@gmail.com', 'Sky fruit juicier');
insert into "ProjectSample".Manages(email, restaurantName) values ('m6@gmail.com', 'Justin Fried Chicken');
insert into "ProjectSample".Manages(email, restaurantName) values ('m7@gmail.com', 'Weiwen Japanese Cuisine');
insert into "ProjectSample".Manages(email, restaurantName) values ('m8@gmail.com', 'res8');
insert into "ProjectSample".Manages(email, restaurantName) values ('m9@gmail.com', 'res9');
insert into "ProjectSample".Manages(email, restaurantName) values ('m10@gmail.com', 'res10');
insert into "ProjectSample".Manages(email, restaurantName) values ('m11@gmail.com', 'res11');
insert into "ProjectSample".Manages(email, restaurantName) values ('m12@gmail.com', 'res12');
insert into "ProjectSample".Manages(email, restaurantName) values ('m13@gmail.com', 'res13');
insert into "ProjectSample".Manages(email, restaurantName) values ('m14@gmail.com', 'res14');
insert into "ProjectSample".Manages(email, restaurantName) values ('m15@gmail.com', 'res15');
insert into "ProjectSample".Manages(email, restaurantName) values ('m16@gmail.com', 'res16');
insert into "ProjectSample".Manages(email, restaurantName) values ('m17@gmail.com', 'res17');
insert into "ProjectSample".Manages(email, restaurantName) values ('m18@gmail.com', 'res18');
insert into "ProjectSample".Manages(email, restaurantName) values ('m19@gmail.com', 'res19');
insert into "ProjectSample".Manages(email, restaurantName) values ('m20@gmail.com', 'res20');

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

/*
*Food Type
*/
Insert into "ProjectSample".foodType(restaurantType) VALUES('Fast Food');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Buffet');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Caf?');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Vegeterian');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Juice Bar');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Singaporean');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Western');
Insert into "ProjectSample".foodType(restaurantType) VALUES('Japanese');

/*
* Insert Area
*/
Insert into "ProjectSample".Area(area) VALUES('North');
Insert into "ProjectSample".Area(area) VALUES('South');
Insert into "ProjectSample".Area(area) VALUES('East');
Insert into "ProjectSample".Area(area) VALUES('West');
Insert into "ProjectSample".Area(area) VALUES('Central');

/*
*Insert Restaurant
*/
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Jumbo Seafood', 'm1@gmail.com', '5.0','9:00','21:00','Buffet');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Leon Zicha Store', 'm2@gmail.com', '5.0','9:00','21:00','Singaporean');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('CaoLiang Mala Wok', 'm3@gmail.com','5.0','9:00','21:00','Vegeterian');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Dehui Coffee Bean', 'm4@gmail.com', '5.0','9:00','21:00','Caf?');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Sky fruit juicier', 'm5@gmail.com','5.0','9:00','21:00','Juice Bar');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Justin Fried Chicken', 'm6@gmail.com','5.0','9:00','21:00','Western');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('Weiwen Japanese Cuisine', 'm7@gmail.com','5.0','9:00','21:00','Japanese');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res8', 'm8@gmail.com','5.0','9:00','21:00','Western');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res9', 'm9@gmail.com','5.0','9:00','21:00','Japanese');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res10', 'm10@gmail.com','5.0','9:00','21:00','Vegeterian');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res11', 'm11@gmail.com','5.0','9:00','21:00','Buffet');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res12', 'm12@gmail.com','5.0','9:00','21:00','Singaporean');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res13', 'm13@gmail.com','5.0','9:00','21:00','Juice Bar');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res14', 'm14@gmail.com','5.0','9:00','21:00','Western');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res15', 'm15@gmail.com','5.0','9:00','21:00','Singaporean');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res16', 'm16@gmail.com','5.0','9:00','21:00','Singaporean');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res17', 'm17@gmail.com','5.0','9:00','21:00','Japanese');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res18', 'm18@gmail.com','5.0','9:00','21:00','Japanese');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res19', 'm19@gmail.com','5.0','9:00','21:00','Western');
insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values
('res20', 'm20@gmail.com','5.0','9:00','21:00','Western');







/**
 * Insert Addresses
 * 
 */
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000000', 'North', 'Blk 000 North road S000000');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000001', 'North', 'Blk 001 North road S000001');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000002', 'North', 'Blk 002 North road S000002');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000003', 'West', 'Blk 003 West road S000003');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000004', 'East', 'Blk 004 East road S000004');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000005', 'Central', 'Blk 005 Central road S000005');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000006', 'Central', 'Blk 006 Central road S000006');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000007', 'Central', 'Blk 007 Central road S000007');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000008', 'South', 'Blk 008 South road S000008');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000009', 'South', 'Blk 009 South road S000009');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000010', 'East', 'Blk 010 East road S000010');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000011', 'East', 'Blk 011 East road S000011');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000012', 'West', 'Blk 012 West road S000012');
insert into "ProjectSample".Address (postalCode, area, fullAddress) values ('000013', 'West', 'Blk 013 West road S000013');

/**
 * Insert Redeems
 * 
 */
insert into "ProjectSample".Redeem (redeemId, description, email) values (1, '10% discount at participating restaurants', 'c1@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (2, '10% discount at participating restaurants', 'c2@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (3, '10% discount at participating restaurants', 'c3@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (4, '10% discount at participating restaurants', 'c4@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (5, '10% discount at participating restaurants', 'c5@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (6, '10% discount at participating restaurants', 'c6@gmail.com');
insert into "ProjectSample".Redeem (redeemId, description, email) values (7, '10% discount at participating restaurants', 'c7@gmail.com');

/**
 * Insert Branches
 * 
 */
--branch 1
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Jumbo Seafood', '000000');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Leon Zicha Store', '000001');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'CaoLiang Mala Wok', '000002');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Dehui Coffee Bean', '000003');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Sky fruit juicier', '000004');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Justin Fried Chicken', '000005');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (1, 'Weiwen Japanese Cuisine', '000006');
--branch 2
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Jumbo Seafood', '000007');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Leon Zicha Store', '000008');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'CaoLiang Mala Wok', '000009');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Dehui Coffee Bean', '000010');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Sky fruit juicier', '000011');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Justin Fried Chicken', '000012');
insert into "ProjectSample".Branch (branchId, restaurantName, postalCode) values (2, 'Weiwen Japanese Cuisine', '000013');


/**
 * Insert Tables
 * 
 */
--table 1
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (1, 5, 1, 'Weiwen Japanese Cuisine');

--table 2
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (2, 5, 1, 'Weiwen Japanese Cuisine');

--table 3
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (3, 5, 1, 'Weiwen Japanese Cuisine');

--table 4
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (4, 10, 2, 'Weiwen Japanese Cuisine');

--table 5
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (5, 10, 2, 'Weiwen Japanese Cuisine');

--table 6
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Jumbo Seafood');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Leon Zicha Store');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'CaoLiang Mala Wok');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Dehui Coffee Bean');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Sky fruit juicier');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Justin Fried Chicken');
insert into "ProjectSample".tables(tableId, capacity, branchId, restaurantName) values (6, 10, 2, 'Weiwen Japanese Cuisine');


/**
 * Insert Meals
 * 
 * 
 */
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Kopi', 3.00, 'Dehui Coffee Bean');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Teh', 2.50, 'Dehui Coffee Bean');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Hard Boiled Egg', 4.00, 'Dehui Coffee Bean');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Kaya Toast', 5.00, 'Dehui Coffee Bean');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Milo', 2.00, 'Dehui Coffee Bean');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Hor Fun', 5.00, 'Leon Zicha Store');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Fried Rice', 6.00, 'Leon Zicha Store');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Beehoon', 7.00, 'Leon Zicha Store');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Fish Soup', 8.00, 'Leon Zicha Store');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Fried Fish', 9.00, 'Leon Zicha Store');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Chili Crab', 30.50, 'Jumbo Seafood');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Butter Lobster', 55.30, 'Jumbo Seafood');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Garlic Mussels', 12.30, 'Jumbo Seafood');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Clam Chowder', 7.20, 'Jumbo Seafood');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Black Pepper Prawns', 30.90, 'Jumbo Seafood');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mala Frog', 15.70, 'CaoLiang Mala Wok');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mala Pot', 20.90, 'CaoLiang Mala Wok');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mala Fish', 17.50, 'CaoLiang Mala Wok');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mala Chicken', 18.90, 'CaoLiang Mala Wok');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mala Duck', 35.90, 'CaoLiang Mala Wok');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Watermelon Juice', 2.50, 'Sky fruit juicier');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Apple Juice', 3.50, 'Sky fruit juicier');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Papaya Juice', 1.20, 'Sky fruit juicier');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Lemon Water', 0.90, 'Sky fruit juicier');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Potat Juice', 100.00, 'Sky fruit juicier');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Black Pepper Chicken', 25.00, 'Justin Fried Chicken');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Cheese Chicken', 26.50, 'Justin Fried Chicken');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Mayonnaise Chicken', 18.00, 'Justin Fried Chicken');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Sour Cream Chicken', 30.35, 'Justin Fried Chicken');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Chilli Chicken', 20.00, 'Justin Fried Chicken');

insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Chicken Don', 12.00, 'Weiwen Japanese Cuisine');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Ichiban Ramen', 15.00, 'Weiwen Japanese Cuisine');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Sushi', 8.00, 'Weiwen Japanese Cuisine');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Udon Noodle', 7.00, 'Weiwen Japanese Cuisine');
insert into "ProjectSample".Meals(mealName, price, restaurantName) values ('Sake', 55.00, 'Weiwen Japanese Cuisine');



/**
 * Insert Ratings
 */
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('1', 2.5, 'Jumbo Seafood');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('2', 2.0, 'Leon Zicha Store');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('3', 3.0, 'CaoLiang Mala Wok');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('4', 1.0, 'Dehui Coffee Bean');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('5', 5.0, 'Sky fruit juicier');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('6', 2.3, 'Justin Fried Chicken');
insert into "ProjectSample".Ratings(ratingId, rating, restaurantName) values ('7', 3.2, 'Weiwen Japanese Cuisine');




/*
 * Insert Reservation
 */
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people,
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c1@gmail.com',  1, 1, 'Jumbo Seafood');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people,
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c2@gmail.com', 1, 1, 'Leon Zicha Store');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people,
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c3@gmail.com', 1, 1, 'CaoLiang Mala Wok');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people,
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c4@gmail.com', 1, 1, 'Dehui Coffee Bean');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people, 
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c5@gmail.com', 1, 1, 'Sky fruit juicier');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people, 
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c6@gmail.com', 1, 1, 'Justin Fried Chicken');
insert into "ProjectSample".Reservation(reservationId, startTime, endTime, reservedDate, status, people, 
email, tableId, branchId, restaurantName) values (1, '9:00', '21:00', '2019-4-11', 1, 5, 'c7@gmail.com', 1, 1, 'Weiwen Japanese Cuisine');







/*
 * Select all statement
 */
select * from "ProjectSample".address;
select * from "ProjectSample".area;
select * from "ProjectSample".branch;
select * from "ProjectSample".customer;
select * from "ProjectSample".foodtype;
select * from "ProjectSample".manager;
select * from "ProjectSample".meals;
select * from "ProjectSample".ratings;
select * from "ProjectSample".redeem;
select * from "ProjectSample".reservation;
select * from "ProjectSample".restaurant;
select * from "ProjectSample".tables;
select * from "ProjectSample".users;


















































































