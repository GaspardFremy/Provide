# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Hôte: 127.0.0.1 (MySQL 5.6.38)
# Base de données: ProvideEasy
# Temps de génération: 2018-07-13 08:58:53 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `siret` varchar(255) DEFAULT NULL,
  `createdDate` timestamp NULL DEFAULT NULL,
  `updatedDate` timestamp NULL DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `sector` varchar(30) DEFAULT NULL,
  `legalName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;

INSERT INTO `clients` (`id`, `name`, `email`, `password`, `address`, `siret`, `createdDate`, `updatedDate`, `storeId`, `sector`, `legalName`, `phone`)
VALUES
	(80,'Gaspard','gaspardfremy123@gmail.com','$2b$10$xMSpo7.BnlTLZNH9l3MFNevvYiLauh2eBeHgnrvwlISOz75/OczIS','1 rue Blabla','12345678910111','2018-07-09 11:43:07',NULL,1,'hôtel','GasCorp','0761443114'),
	(81,'Bourgogne Sud','contact@bourgognesud.com','$2b$10$nMprOL8EpgTErTdCyZ8LYeL3LpLNPXACsMJij3uPh7RDuyMCsvxZ.','14 Rue de Clichy, 75009 Paris','19287398728310','2018-07-11 09:33:10',NULL,1,'restaurant','Bourgogne Sud SAS','0148745127'),
	(82,'Hôtel Secret de Paris','contact@secretparis.com','$2b$10$bdm6jWi5jzRBMIV1zV3Wg.a6LQx0go7OZqMmawhwPuU9FjY2UE70G','2 Rue de Parme, 75009 Paris','18927387182838','2018-07-11 09:56:38',NULL,1,'hôtel','SecretParisSARL ','0178563727'),
	(84,'Chez papa','contact@chezpapa.com','$2b$10$00l/.uFT/VG1tTceNja5ye01dc1yvhW4NyWQ3d54B.kVtZNQuEXtm','59 rue de Clichy 75009 Paris','91028907482839','2018-07-11 12:05:46',NULL,1,'restaurant','Chez papa SARL','0140358901'),
	(85,'Hôtel R de Paris','contact@hotelr.com','$2b$10$KSH7G0FChPo2iOTGa3BCj.QN.Fxzg9f.Gnm/Ij3LTpVdfaEEuCMYu','41 Rue de Clichy, 75009 Paris','92897398728823','2018-07-11 12:17:09',NULL,1,'hôtel','HôtelRSAS','0140823620'),
	(94,'Théâtre de l Oeuvre','contact@theatredeloeuvre.com','$2b$10$GLxRE6Yn/YXDwooVSY4NWOz.RERiLfCcF3YWzUNXH.awHQVfx7kjO','3 cité Monthiers,  75009 Paris','92873987288237','2018-07-11 12:29:31',NULL,1,'restaurant','Théâtre de l OeuvreSAS','0144538888'),
	(95,'Le Béguin','contact@lebeguin.com','$2b$10$NOGsWvhBR/FsOPsyta8cR.2W1R2TFM9CggWFtN23Dq1e7iR6fgkP6','2 Rue du Cardinal Mercier, 75009 Paris','09287938798382','2018-07-11 12:34:28',NULL,1,'restaurant','Le Béguin SARL','0142815820');

/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table invoices
# ------------------------------------------------------------

DROP TABLE IF EXISTS `invoices`;

CREATE TABLE `invoices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `createdDate` timestamp NULL DEFAULT NULL,
  `statusId` timestamp NULL DEFAULT NULL,
  `updatedDate` timestamp NULL DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table orderedProducts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orderedProducts`;

CREATE TABLE `orderedProducts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `orderedProducts` WRITE;
/*!40000 ALTER TABLE `orderedProducts` DISABLE KEYS */;

INSERT INTO `orderedProducts` (`id`, `orderId`, `productId`, `quantity`)
VALUES
	(1,44,1,10),
	(2,44,3,2),
	(3,45,3,2),
	(12,51,3,20),
	(13,52,3,18),
	(14,52,26,1),
	(15,53,26,1),
	(16,54,26,1),
	(17,54,39,3),
	(18,55,26,1),
	(19,55,39,3),
	(20,56,26,1),
	(21,56,39,3),
	(22,56,3,4),
	(23,56,4,1),
	(24,57,4,1),
	(25,57,11,1),
	(26,57,26,1),
	(27,59,4,1),
	(28,59,11,1),
	(29,59,26,1),
	(30,60,4,1),
	(31,60,26,1),
	(32,61,4,1),
	(33,61,26,1);

/*!40000 ALTER TABLE `orderedProducts` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'ordered',
  `createdDate` timestamp NULL DEFAULT NULL,
  `deadlineDate` varchar(100) DEFAULT NULL,
  `storeId` int(11) DEFAULT '1',
  `deadlineTime` varchar(100) DEFAULT NULL,
  `saved` int(11) DEFAULT '0',
  `orderName` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;

INSERT INTO `orders` (`id`, `clientId`, `status`, `createdDate`, `deadlineDate`, `storeId`, `deadlineTime`, `saved`, `orderName`)
VALUES
	(44,95,'canceled','2018-07-12 18:55:27','2018-07-12',1,'18:00',0,'null'),
	(45,95,'done','2018-07-12 19:00:38','2018-07-12',1,'12:00',0,'null'),
	(51,95,'done','2018-07-12 20:26:37','2018-07-12',1,'13:00',0,'null'),
	(52,95,'done','2018-07-12 20:30:26','2018-07-12',1,'12:01',0,'null'),
	(53,95,'pending','2018-07-12 20:32:27','2018-07-13',1,'12:00',0,'null'),
	(54,95,'pending','2018-07-12 20:33:24','2018-07-13',1,'12:00',0,'null'),
	(55,95,'done','2018-07-12 21:02:03','2018-07-12',1,'13:59',1,'Mardi'),
	(56,95,'done','2018-07-12 21:26:13','2018-07-12',1,'13:05',1,'Marrdi'),
	(57,95,'done','2018-07-12 22:27:36','2018-07-12',1,'12:01',1,'sdsdf'),
	(59,95,'pending','2018-07-12 22:59:28','2018-07-11',1,'13:06',0,'null'),
	(60,95,'done','2018-07-12 23:23:40','2018-07-12',1,'12:02',0,'null'),
	(61,95,'pending','2018-07-13 09:26:40','2018-07-12',1,'14:08',0,'null');

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(13,2) DEFAULT NULL,
  `createdDate` timestamp NULL DEFAULT NULL,
  `editedDate` timestamp NULL DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `availability` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT '0',
  `addedDate` timestamp NULL DEFAULT NULL,
  `imgURL` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`id`, `name`, `price`, `createdDate`, `editedDate`, `storeId`, `category`, `availability`, `quantity`, `addedDate`, `imgURL`)
VALUES
	(1,'Baguette',1.00,NULL,NULL,1,'pains',1,0,NULL,'baguette'),
	(2,'Croissant',1.20,NULL,NULL,1,'vienoiseries',1,0,NULL,'croissant'),
	(3,'B. tradition',1.00,NULL,NULL,1,'pains',1,0,NULL,'b_tradition'),
	(4,'B. campagne',1.30,NULL,NULL,1,'pains',1,0,NULL,'b_campagne'),
	(5,'B. céréales',1.60,NULL,NULL,1,'pains',1,0,NULL,'b_cereale'),
	(10,'P. épautre',2.80,NULL,NULL,1,'pains',1,0,NULL,'pain_epautre'),
	(11,'P. châtaignes',3.90,NULL,NULL,1,'pains',1,0,NULL,'pain_chataigne'),
	(13,'Pain chocolat',1.30,NULL,NULL,1,'vienoiseries',1,0,NULL,'pain_chocolat'),
	(14,'Pain raisins',1.80,NULL,NULL,1,'vienoiseries',1,0,NULL,'pain_raisins'),
	(15,'chausson pomme',1.80,NULL,NULL,1,'vienoiseries',1,0,NULL,'chausson'),
	(16,'Tartelette fraise',4.00,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(17,'Velour craquant',4.40,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(18,'Tartelette citron',4.40,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(19,'Jivara',4.40,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(20,'Choco Choco',4.40,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(21,'Mille-feuilles',3.50,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(22,'Éclair Café',3.20,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(23,'Éclair Chocolat',3.20,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(24,'Fraisier',4.40,NULL,NULL,1,'pâtisseries',1,0,NULL,NULL),
	(26,'1/4 Auvergnate',3.00,NULL,NULL,1,'pains',1,0,NULL,'auvergnate'),
	(27,'1/4 Meule',2.70,NULL,NULL,1,'pains',1,0,NULL,'meule'),
	(28,'Pain brioché',4.50,NULL,NULL,1,'vienoiseries',1,0,NULL,'pain_brioche'),
	(29,'Drops',1.80,NULL,NULL,1,'vienoiseries',1,0,NULL,'drops'),
	(30,'Financier framboise',1.90,NULL,NULL,1,'vienoiseries',1,0,NULL,'financier'),
	(31,'Brioche tête',1.80,NULL,NULL,1,'vienoiseries',1,0,NULL,'brioche'),
	(32,'Kouglof',2.20,NULL,NULL,1,'vienoiseries',1,0,NULL,'kouglof'),
	(33,'Brioche Praline',5.00,NULL,NULL,1,'vienoiseries',1,0,NULL,'brioche_pralines'),
	(34,'Brioche sucre',1.40,NULL,NULL,1,'vienoiseries',1,0,NULL,'brioche_sucre'),
	(35,'Brioche chocolat',1.40,NULL,NULL,1,'vienoiseries',1,0,NULL,'brioche_chocolat'),
	(36,'Moelleux',3.50,NULL,NULL,1,'vienoiseries',1,0,NULL,'moelleux'),
	(37,'Pain maison',3.00,NULL,NULL,1,'pains',1,0,NULL,'pain_maison'),
	(38,'Pain aux noix',3.80,NULL,NULL,1,'pains',1,0,NULL,'pain_noix'),
	(39,'Pain forestier 100g',1.15,NULL,NULL,1,'pains',1,0,NULL,'pain_forestier'),
	(40,'Pain Antant 100g',0.68,NULL,NULL,1,'pains',1,0,NULL,'pain_antan');

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table savedOrders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `savedOrders`;

CREATE TABLE `savedOrders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table stores
# ------------------------------------------------------------

DROP TABLE IF EXISTS `stores`;

CREATE TABLE `stores` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;

INSERT INTO `stores` (`id`, `name`, `email`, `password`)
VALUES
	(1,'Clichy','admin@gmail.com','$2b$10$xMSpo7.BnlTLZNH9l3MFNevvYiLauh2eBeHgnrvwlISOz75/OczIS');

/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
