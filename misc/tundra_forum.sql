-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2018 at 01:11 AM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tundra_forum`
--

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE `boards` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `thread_count` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `post_count` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `permission` int(11) NOT NULL DEFAULT '0',
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`id`, `name`, `description`, `thread_count`, `post_count`, `permission`, `icon`) VALUES
(1, 'Introductions', 'Introduce yourself', 0, 0, 0, NULL),
(2, 'General Discussion', 'Talk about anything', 0, 0, 0, NULL),
(3, 'Staff Only', 'This board is for the staff to discuss things', 0, 0, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) UNSIGNED NOT NULL,
  `threads_id` int(11) UNSIGNED NOT NULL,
  `author` int(11) UNSIGNED NOT NULL,
  `post` longtext NOT NULL,
  `first_post` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `ip_address` varchar(20) NOT NULL,
  `post_date` datetime DEFAULT NULL,
  `edit_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `threads`
--

CREATE TABLE `threads` (
  `id` int(11) UNSIGNED NOT NULL,
  `boards_id` int(11) UNSIGNED NOT NULL,
  `author` int(11) UNSIGNED NOT NULL,
  `last_poster_id` int(11) NOT NULL,
  `last_poster_date` datetime DEFAULT NULL,
  `post_date` datetime DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `post_count` int(11) UNSIGNED NOT NULL DEFAULT '1',
  `closed` tinyint(3) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `users_id` int(11) UNSIGNED NOT NULL,
  `purpose` int(11) NOT NULL COMMENT '1=New account; 2=Forgot password; 3=Login',
  `ip_address` varchar(15) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `expires` datetime NOT NULL,
  `token` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `users_id`, `purpose`, `ip_address`, `expires`, `token`) VALUES
(6, 1, 3, '::ffff:127.0.0.', '0000-00-00 00:00:00', '5Fgk4nTyEaMf41cHRYp5vHbp12JUEyVUa5o8xQt3U2c9IRjuTtaeSdR9aJe09hkNJ3ESQ6W2OmMjN0w2fIwuC3a8cf1bhzML3wl2');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(24) NOT NULL,
  `email` varchar(50) NOT NULL,
  `permission` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `post_count` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `thread_count` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `join_date` datetime NOT NULL,
  `last_seen` datetime NOT NULL,
  `title` varchar(30) DEFAULT NULL,
  `userscol` varchar(45) DEFAULT NULL,
  `token` varchar(96) DEFAULT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `permission`, `post_count`, `thread_count`, `join_date`, `last_seen`, `title`, `userscol`, `token`, `password`) VALUES
(1, '1', '1', 123, 0, 0, '2018-05-08 15:57:47', '2018-05-08 15:57:47', NULL, NULL, NULL, '$2b$10$yuSERw52hHwkltjVsiAzX.3dfBOzdxD7Va7jLHA5mtPz5pP0CNdki');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_thread_id` (`threads_id`),
  ADD KEY `IDX_author` (`author`);

--
-- Indexes for table `threads`
--
ALTER TABLE `threads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_board_id` (`boards_id`),
  ADD KEY `IDX_threads_author` (`author`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `fk_users_id` (`users_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNI_name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `threads`
--
ALTER TABLE `threads`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FK_posts_author` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_posts_thread_id` FOREIGN KEY (`threads_id`) REFERENCES `threads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `threads`
--
ALTER TABLE `threads`
  ADD CONSTRAINT `FK_threads_author` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_threads_board_id` FOREIGN KEY (`boards_id`) REFERENCES `boards` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `fk_users_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
