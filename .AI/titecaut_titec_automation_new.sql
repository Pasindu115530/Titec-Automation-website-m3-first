-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 02, 2026 at 11:55 AM
-- Server version: 8.0.46-cll-lve
-- PHP Version: 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `titecaut_titec_automation_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_path`, `created_at`, `updated_at`) VALUES
(2, 'Siemence', 'siemence', 'brands/1771232700_svgviewer-png-output.png', '2026-02-16 08:47:43', '2026-03-05 08:17:36'),
(3, 'Mistubishi', 'mistubishi', 'brands/1771234816_Mistubishi.png', '2026-02-16 09:05:53', '2026-02-16 09:40:16'),
(8, 'Schneider', 'schneider', 'brands/1771235998_Schneider Electric.png', '2026-02-16 09:59:58', '2026-02-16 09:59:58'),
(5, 'Omron', 'omron', 'brands/1771235898_logo_01_b13-260967.gif', '2026-02-16 09:58:18', '2026-02-16 09:58:18'),
(6, 'ABB', 'abb', 'brands/1771235918_ABB.svg', '2026-02-16 09:58:27', '2026-02-16 09:58:38'),
(7, 'Wecon', 'wecon', 'brands/1771236591_Wacon.png', '2026-02-16 09:58:57', '2026-03-05 08:17:24'),
(9, 'Yaskawa', 'yaskawa', 'brands/1771236131_layout_set_logo.png', '2026-02-16 10:02:11', '2026-02-16 10:02:11'),
(10, 'Kawasaki', 'kawasaki', 'brands/1771236203_Kawasaki.svg', '2026-02-16 10:03:23', '2026-02-16 10:03:23'),
(11, 'KUKA', 'kuka', 'brands/1771236253_KUKA.svg', '2026-02-16 10:04:13', '2026-02-16 10:04:13'),
(13, 'BORUNTE', 'borunte', 'brands/1771239515_BORUNTE Robots.png', '2026-02-16 10:58:35', '2026-02-16 10:58:35'),
(14, 'PHOENIX CONTACT', 'phoenix-contact', 'brands/1778052758_images.png', '2026-05-06 07:32:38', '2026-05-06 07:32:38');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('titec-automation-cache-6156dc274114a28979970e962e7e77401b4812d8', 'i:1;', 1788330014),
('titec-automation-cache-6156dc274114a28979970e962e7e77401b4812d8:timer', 'i:1788330014;', 1788330014),
('titec-automation-cache-fb71bd740daf3358c208ab1ea2107cb267af6698', 'i:2;', 1788330021),
('titec-automation-cache-fb71bd740daf3358c208ab1ea2107cb267af6698:timer', 'i:1788330021;', 1788330021);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `company`, `email`, `phone`, `message`, `created_at`, `updated_at`) VALUES
(1, 'Pasindu', 'Skyray', 'fc115530@foc.sjp.ac.lk', '+94 719367720', 'Hii Good morning', '2026-01-19 10:01:24', '2026-01-19 10:01:24'),
(2, 'Pasindu', 'Skyray sl', 'fc115530@foc.sjp.ac.lk', '9789461513', '2nd test', '2026-01-19 10:05:50', '2026-01-19 10:05:50'),
(3, 'Pasindu Udana', 'Skyray', 'fc115530@foc.sjp.ac.lk', '0719637720', 'Need MCB', '2026-01-23 03:19:58', '2026-01-23 03:19:58'),
(4, 'pasindu', 'skyray', 'fc115530@foc.sjp.ac.lk', '0719367720', 'Hiii', '2026-01-23 03:27:37', '2026-01-23 03:27:37'),
(5, 'Pasindj', 'Hwjn', 'pasinduudana12m2@gmail.com', '0719367720', 'Yujjaa', '2026-02-05 08:57:13', '2026-02-05 08:57:13'),
(6, 'Udana', 'sktyyrat', 'fc115530@foc.sjp.ac.lk', '0719367720', 'Test', '2026-02-05 09:12:05', '2026-02-05 09:12:05'),
(7, 'Pasindu Udana', 'skyray', 'fc115530@foc.sjp.ac.lk', '0719367720', 'Test 2', '2026-02-05 09:14:48', '2026-02-05 09:14:48'),
(8, 'Pasunoiq', '5sqwd', 'pasinduudana12m2@gmail.com', '9478215', 'dwdwd', '2026-02-05 09:21:22', '2026-02-05 09:21:22'),
(9, 'adw', 'efdf', 'fc115530@foc.sjp.ac.lk', '7848756', 'efefefw', '2026-02-05 09:26:29', '2026-02-05 09:26:29'),
(10, 'Pasindu', 'Skyray', 'pasinduudana12m2@gmail.com', '0719367720', 'Hi test im pasindu', '2026-02-06 11:13:10', '2026-02-06 11:13:10'),
(11, 'kl', 'skyrasy', 'fc115530@foc.sjp.ac.lk', '947822356', 'test hiii', '2026-02-06 11:46:38', '2026-02-06 11:46:38'),
(12, 'Thulana', 'Dulan', 'thulanadj@gmail.com', '+94705170264', 'hi', '2026-02-06 11:47:27', '2026-02-06 11:47:27'),
(13, 'thulana', 'skyray', 'thulanadj@gmail.com', NULL, 'hi', '2026-02-08 06:09:40', '2026-02-08 06:09:40'),
(14, 'Pasindu', 'Udana', 'fc115530@foc.sjp.ac.lk', '978422856', 'Test msg pass', '2026-02-08 06:37:30', '2026-02-08 06:37:30'),
(15, 'Pasindiu', 'skyray', 'fc115530@foc.sjp.ac.lk', '0719367720', 'test msg', '2026-02-08 10:34:28', '2026-02-08 10:34:28'),
(16, 'Dulan', 'SkyRay', 'thulanadj@gmail.com', '+94705170264', 'i have requested a quotation but haven\'t recived yet', '2026-02-11 03:00:28', '2026-02-11 03:00:28'),
(17, 'Test', 'Test', 'thulanadj@gmail.com', '+94705170264', 'Test Contact', '2026-02-11 16:09:57', '2026-02-11 16:09:57'),
(18, 'lahiru', 'Titec', 'madhusanka1171@gmail.com', '0770417564', 'test', '2026-02-11 16:10:18', '2026-02-11 16:10:18'),
(19, 'jithma', 'TITEC', 'jithma1998@gmail.com', NULL, 'hii', '2026-02-11 16:10:59', '2026-02-11 16:10:59'),
(20, 'asdasd', 'asdasd', 'thulanadj@gmail.com', NULL, 'asdasd', '2026-02-11 16:11:12', '2026-02-11 16:11:12');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_01_08_130151_create_personal_access_tokens_table', 1),
(5, '2026_01_10_create_projects_table', 1),
(6, '2026_01_13_163631_create_products', 1),
(7, '2026_01_13_163749_create_quotation_requests', 1),
(8, '2026_01_13_163822_create_quotation_request_items', 1),
(9, '2026_01_13_164027_create_quotations', 1),
(10, '2026_01_14_031349_add_slug_to_products_table', 1),
(11, '2026_01_14_031724_add_remarks_to_quotations_table', 1),
(12, '2026_01_14_040637_add_details_to_products_table', 1),
(13, '2026_01_16_073711_add_project_image_urls_to_projects_table', 2),
(14, '2026_01_17_060556_add_contact_columns_to_quotation_requests', 3),
(15, '2026_01_17_063058_remove_user_id_from_quotation_requests', 4),
(16, '2026_01_19_152455_create_contact_messages_table', 5),
(17, '2026_01_22_231536_add_soft_deletes_to_products_table', 6),
(18, '2026_01_30_185421_add_details_to_projects_table', 7),
(19, '2026_01_30_215455_add_brand_to_products_table', 8),
(20, '2026_02_05_234823_add_file_path_to_quotation_requests_table', 9),
(21, '2026_02_06_001952_add_client_logo_to_projects_table', 10),
(22, '2026_02_07_160746_update_products_table_for_store_visibility', 11),
(23, '2026_02_10_164457_add_logo_path_to_projects_table', 12),
(24, '2026_02_12_015700_add_unit_to_products_table', 13),
(25, '2026_02_12_015759_add_unit_to_products_table', 13),
(26, '2026_02_14_234920_create_brands_table', 14),
(27, '2026_02_15_000232_add_brand_id_to_products_table', 15),
(28, '2026_02_16_create_services_tables', 16),
(29, '2026_03_05_230226_add_show_price_to_products_table', 16);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '4cd246b73a91961ffb99e25758118bee69209a020a16717b7d9c8e371403d2a5', '[\"*\"]', '2026-01-14 06:36:31', NULL, '2026-01-14 05:51:04', '2026-01-14 06:36:31'),
(2, 'App\\Models\\User', 1, 'auth_token', '1046cb66664c8a35860b5b11b0e4b247b76d69b4c28a4786e6963f3c8531c017', '[\"*\"]', '2026-01-14 06:43:59', NULL, '2026-01-14 06:37:30', '2026-01-14 06:43:59'),
(3, 'App\\Models\\User', 1, 'auth_token', 'b2c2043db08f4ce96ad5dfc37fc06842813c0e8aa71079101ca195dbe911028f', '[\"*\"]', '2026-01-15 06:09:24', NULL, '2026-01-15 06:08:59', '2026-01-15 06:09:24'),
(4, 'App\\Models\\User', 1, 'auth_token', 'f9136d9e047aaa34af3b251c28e8077f2b50c1cfb78fa6f16150c53fe336856b', '[\"*\"]', '2026-01-16 12:45:05', NULL, '2026-01-16 03:52:09', '2026-01-16 12:45:05'),
(5, 'App\\Models\\User', 1, 'auth_token', 'e872b00b32816f7086ba863577e8bdce1464c9703a31cdcbb8821277fad0f739', '[\"*\"]', '2026-01-17 01:47:50', NULL, '2026-01-16 11:47:12', '2026-01-17 01:47:50'),
(6, 'App\\Models\\User', 1, 'auth_token', '29b178ea474f4978786f494536098f963838354a3c182c4a78ed5261490b4446', '[\"*\"]', '2026-01-19 00:53:55', NULL, '2026-01-16 23:17:29', '2026-01-19 00:53:55'),
(7, 'App\\Models\\User', 1, 'auth_token', '1dfc6081505fb6a42581638b7147e2f7c2d4bd72530ce9683815c340466e32f5', '[\"*\"]', '2026-01-17 05:17:39', NULL, '2026-01-17 04:04:33', '2026-01-17 05:17:39'),
(8, 'App\\Models\\User', 1, 'auth_token', '3de73e801c71512caf71c8e9d1e5bc4d3fed4e056b5044496a48f792ea73373e', '[\"*\"]', '2026-01-17 06:12:22', NULL, '2026-01-17 05:41:25', '2026-01-17 06:12:22'),
(9, 'App\\Models\\User', 1, 'auth_token', '4d31f0215b354bb0ff332b930f548ce4f2204b35ae536bb06b446dad45baf531', '[\"*\"]', '2026-01-17 06:15:12', NULL, '2026-01-17 06:12:32', '2026-01-17 06:15:12'),
(10, 'App\\Models\\User', 1, 'auth_token', 'f3f5fe5fceb5ab084668b04e737d922c020e2fa0235c20cb48dfbf5e0a92c159', '[\"*\"]', '2026-01-17 06:19:43', NULL, '2026-01-17 06:16:08', '2026-01-17 06:19:43'),
(11, 'App\\Models\\User', 1, 'auth_token', '82bff0504025f198ae682bff7f839e69a695b37b6eadef0fa70496e97665cbcb', '[\"*\"]', '2026-01-22 18:18:57', NULL, '2026-01-19 01:02:45', '2026-01-22 18:18:57'),
(12, 'App\\Models\\User', 1, 'auth_token', 'c333bdec728f3f5213f40043064ee525b8b3b18177ec4a0681c41233ffdc63a4', '[\"*\"]', '2026-01-19 08:01:59', NULL, '2026-01-19 07:47:08', '2026-01-19 08:01:59'),
(13, 'App\\Models\\User', 1, 'auth_token', '087934f196b8d7cf399950ff8e18be243b05736f168a28b6c6ab30fcb3b314ee', '[\"*\"]', '2026-01-19 09:49:01', NULL, '2026-01-19 09:43:35', '2026-01-19 09:49:01'),
(14, 'App\\Models\\User', 1, 'auth_token', '496f63368d5d1f1866147479ee4484f847e9d1806bc450afc2268a1477f2428b', '[\"*\"]', '2026-01-22 20:02:10', NULL, '2026-01-22 18:28:00', '2026-01-22 20:02:10'),
(15, 'App\\Models\\User', 1, 'auth_token', '630a2664de0d417386a3a4e06a845a97c467484a650d0c8a86a020ba5513f19b', '[\"*\"]', '2026-01-22 20:25:05', NULL, '2026-01-22 20:12:42', '2026-01-22 20:25:05'),
(16, 'App\\Models\\User', 1, 'auth_token', 'd9fe705b2ce72bcd39df216f913c8662663e4f939db15e7e7575bc5af49ec453', '[\"*\"]', '2026-01-22 20:45:39', NULL, '2026-01-22 20:39:11', '2026-01-22 20:45:39'),
(17, 'App\\Models\\User', 1, 'auth_token', '9ed66c71ad6213bf89fe79c6324d12ee3803a561bfc9b40d4396088fb2fffbea', '[\"*\"]', '2026-01-23 03:13:35', NULL, '2026-01-23 02:50:49', '2026-01-23 03:13:35'),
(18, 'App\\Models\\User', 1, 'auth_token', 'f379c4ba7446f50ae5d2f6a9548ff12b2863567fb0795db8095fccccb805d9bc', '[\"*\"]', '2026-01-23 03:25:06', NULL, '2026-01-23 03:23:10', '2026-01-23 03:25:06'),
(19, 'App\\Models\\User', 1, 'auth_token', '4ed370631e8850690468ad921dac52dc13b26e269f6d1aed7d160cedd73c1504', '[\"*\"]', '2026-01-23 03:33:48', NULL, '2026-01-23 03:29:38', '2026-01-23 03:33:48'),
(20, 'App\\Models\\User', 1, 'auth_token', 'c67e43cc282ce91fe8bce8125d0959e47388e0cd77ec182ef923cec212ac50d6', '[\"*\"]', '2026-01-30 17:11:08', NULL, '2026-01-30 13:02:44', '2026-01-30 17:11:08'),
(21, 'App\\Models\\User', 1, 'auth_token', '62bf243f042ad1ab3a2bc47a4bddb10623ff0f3d4c07dba154d01b0037c68a05', '[\"*\"]', '2026-02-02 07:12:34', NULL, '2026-02-02 06:57:58', '2026-02-02 07:12:34'),
(22, 'App\\Models\\User', 1, 'auth_token', '26f858b831214e19deaf0c616ee24c717cd096876ad1ced6190b489298a81c01', '[\"*\"]', '2026-02-02 07:47:47', NULL, '2026-02-02 07:21:18', '2026-02-02 07:47:47'),
(23, 'App\\Models\\User', 1, 'auth_token', '6e60ced3333f2ce08f4bef070332b659d02f086c9c93f908008451446fd5f993', '[\"*\"]', '2026-02-06 10:15:23', NULL, '2026-02-05 10:44:43', '2026-02-06 10:15:23'),
(24, 'App\\Models\\User', 1, 'auth_token', '6277f4db474d17a375e67dd32acccfc704693aa2ee9485575224751daab5e35d', '[\"*\"]', '2026-02-06 11:51:49', NULL, '2026-02-05 12:48:46', '2026-02-06 11:51:49'),
(25, 'App\\Models\\User', 1, 'auth_token', '712d402dbf8d1beda685aed1a801e195685cf2cf97c620c891c7c24611a2e8d2', '[\"*\"]', '2026-02-05 22:13:00', NULL, '2026-02-05 21:27:51', '2026-02-05 22:13:00'),
(26, 'App\\Models\\User', 1, 'auth_token', 'bb9c8392329b1652db4b675e9344f32496089656003f2f11ff91de6ddaf37e30', '[\"*\"]', '2026-02-05 22:38:58', NULL, '2026-02-05 22:18:10', '2026-02-05 22:38:58'),
(27, 'App\\Models\\User', 1, 'auth_token', '157b255c1fb45f0690b8612d6f6f9d6cbe351c53e56f252d9549d7cbfadb1b61', '[\"*\"]', '2026-02-06 08:22:06', NULL, '2026-02-06 08:04:27', '2026-02-06 08:22:06'),
(28, 'App\\Models\\User', 4, 'auth_token', 'bbed9d9aa2e24aeb7b2fc7f4121df27557b9d8dcff804f31738379e98d6a584e', '[\"*\"]', '2026-02-06 08:39:53', NULL, '2026-02-06 08:39:52', '2026-02-06 08:39:53'),
(29, 'App\\Models\\User', 5, 'auth_token', 'd03ff8e43292f7a88bb9338b785b0be096fed025023ae03851636ee974aa80e1', '[\"*\"]', '2026-02-06 11:34:10', NULL, '2026-02-06 08:40:23', '2026-02-06 11:34:10'),
(30, 'App\\Models\\User', 1, 'auth_token', '7530bcfae9d3d1bb695738238eed49341514adeeff717625274d6ad3ce5a85fd', '[\"*\"]', '2026-02-07 10:59:30', NULL, '2026-02-06 11:34:21', '2026-02-07 10:59:30'),
(31, 'App\\Models\\User', 4, 'auth_token', '8179f06f669773f2e1435290b9f1b320a7c3976c12fa27f7bfe312ab15bd2ac8', '[\"*\"]', '2026-02-06 11:43:28', NULL, '2026-02-06 11:40:23', '2026-02-06 11:43:28'),
(32, 'App\\Models\\User', 5, 'auth_token', '26c954ce6a59733a67f257cce3f2f63dbde6b710984968db9143bf14ea428cc2', '[\"*\"]', '2026-02-06 17:04:09', NULL, '2026-02-06 16:32:31', '2026-02-06 17:04:09'),
(33, 'App\\Models\\User', 1, 'auth_token', '3391d7e2293b4098f9c2ee91aa88f8a19c3a80b2aa2abd1317c8f9197d3d6698', '[\"*\"]', '2026-02-07 10:11:47', NULL, '2026-02-07 10:05:20', '2026-02-07 10:11:47'),
(34, 'App\\Models\\User', 1, 'auth_token', 'd3a1665d0b9e5f5f7f9e1ad2222c815b1531cbba44d4c0ef091c9f5fdb051811', '[\"*\"]', NULL, NULL, '2026-02-07 11:08:10', '2026-02-07 11:08:10'),
(35, 'App\\Models\\User', 1, 'auth_token', '054c739a4f5629dcebe4fe70f109c578944237bae600a7eb1f0524662eda64e9', '[\"*\"]', '2026-02-08 10:41:28', NULL, '2026-02-07 11:08:18', '2026-02-08 10:41:28'),
(36, 'App\\Models\\User', 5, 'auth_token', 'd7e9642b29b5f987c2abbe687ca145ee2747dd97661e330cf184052f977569dc', '[\"*\"]', '2026-02-08 06:38:27', NULL, '2026-02-08 05:48:13', '2026-02-08 06:38:27'),
(37, 'App\\Models\\User', 5, 'auth_token', '986fcd53840255c607997496cc749e6b2a02aa1dd3e96d22bd5124c0afdf0cf1', '[\"*\"]', '2026-02-08 10:39:44', NULL, '2026-02-08 06:38:42', '2026-02-08 10:39:44'),
(38, 'App\\Models\\User', 1, 'auth_token', 'fbd2567e1153addd7c215778baec0bbfe9b6c75e46142207df12d2a8765e59fd', '[\"*\"]', '2026-02-08 08:32:30', NULL, '2026-02-08 08:21:27', '2026-02-08 08:32:30'),
(39, 'App\\Models\\User', 1, 'auth_token', '10cc134745f64396bb5f30606a21c3ce9e430c9701f7d0b194662d615f335927', '[\"*\"]', '2026-02-08 10:21:54', NULL, '2026-02-08 09:46:08', '2026-02-08 10:21:54'),
(40, 'App\\Models\\User', 1, 'auth_token', 'e3237fb1a5a6340883952c7997a71d0999eefcea74ad374e87b4b0e186d4be25', '[\"*\"]', '2026-02-09 09:12:52', NULL, '2026-02-08 18:08:05', '2026-02-09 09:12:52'),
(41, 'App\\Models\\User', 1, 'auth_token', '1fffd0bb1f04437a7dd1d6947d787b03c4aeefb8dcb5fdaceaade9bc64524cc0', '[\"*\"]', '2026-02-10 11:31:34', NULL, '2026-02-10 11:30:34', '2026-02-10 11:31:34'),
(42, 'App\\Models\\User', 1, 'auth_token', 'b46a84997bb5088b6d7f28b5ca3161b47d0b52dafaabad5356d2ad9e27cfaea8', '[\"*\"]', '2026-02-11 03:12:41', NULL, '2026-02-10 11:38:15', '2026-02-11 03:12:41'),
(43, 'App\\Models\\User', 1, 'auth_token', '0a2ec38706493aae0a8257f1deddcb5f2d2c02c99b35d2867fd47e3505c6261d', '[\"*\"]', '2026-02-11 21:38:55', NULL, '2026-02-11 15:31:30', '2026-02-11 21:38:55'),
(44, 'App\\Models\\User', 4, 'auth_token', '1f445d8fe97d3e28a5e249fe955b0e0b492ed7fca744221f210a4f132a5615e1', '[\"*\"]', '2026-02-11 15:38:27', NULL, '2026-02-11 15:35:06', '2026-02-11 15:38:27'),
(45, 'App\\Models\\User', 4, 'auth_token', '251e36e71f916ce2e5baea65052124742b858b1444a9bd40b08d470e0f633f69', '[\"*\"]', '2026-02-11 16:21:01', NULL, '2026-02-11 15:37:03', '2026-02-11 16:21:01'),
(46, 'App\\Models\\User', 4, 'auth_token', 'e40a7666dc5e4d49a07712a39c14ee7be09ce54848a754954c181c863274a0ab', '[\"*\"]', '2026-02-11 21:20:24', NULL, '2026-02-11 15:37:04', '2026-02-11 21:20:24'),
(47, 'App\\Models\\User', 5, 'auth_token', 'faf47d9d992f7eb2b8995d1a17cc12ceb747733f2715535d48af414cb731494c', '[\"*\"]', '2026-02-11 16:32:50', NULL, '2026-02-11 15:49:46', '2026-02-11 16:32:50'),
(48, 'App\\Models\\User', 1, 'auth_token', 'ac2c300bbe795d77acb16585dda4f10fb50525ad21a003ba6115d649e655efff', '[\"*\"]', '2026-02-11 21:16:19', NULL, '2026-02-11 20:17:05', '2026-02-11 21:16:19'),
(49, 'App\\Models\\User', 1, 'auth_token', 'a5ce18fe178972e07424a715f4d523e2140d3926386acd02c8d5d1b2f05b07b2', '[\"*\"]', '2026-02-12 03:02:19', NULL, '2026-02-12 03:01:57', '2026-02-12 03:02:19'),
(50, 'App\\Models\\User', 1, 'auth_token', 'aaad0f22daa9029a4cae34e52601663ca0fd97c4e638b2b64efd68bf85ff9420', '[\"*\"]', '2026-02-13 07:11:08', NULL, '2026-02-13 07:09:49', '2026-02-13 07:11:08'),
(51, 'App\\Models\\User', 1, 'auth_token', '9d559efd79e14bd1c05e71a93a5219d01bb44792477b6851b3dd26b67e73f67d', '[\"*\"]', '2026-02-13 18:21:50', NULL, '2026-02-13 07:50:26', '2026-02-13 18:21:50'),
(52, 'App\\Models\\User', 1, 'auth_token', 'cd3225cab58355b232b6047a11693abc3515d915d574a77838e4a37cd07bee4a', '[\"*\"]', '2026-02-13 17:34:12', NULL, '2026-02-13 08:04:03', '2026-02-13 17:34:12'),
(53, 'App\\Models\\User', 1, 'auth_token', '39dc456596e0f2e670d84d88bbdfe109311abc1af7dc20f94f7a716c82222703', '[\"*\"]', '2026-02-14 14:22:03', NULL, '2026-02-14 14:20:47', '2026-02-14 14:22:03'),
(54, 'App\\Models\\User', 1, 'auth_token', 'ca2bb4a69fdff1c86f50d146b4c1fcd39dac69a2ccfdc63801b11b399e51bd91', '[\"*\"]', '2026-02-14 20:07:38', NULL, '2026-02-14 18:05:01', '2026-02-14 20:07:38'),
(55, 'App\\Models\\User', 1, 'auth_token', 'e4bd24607c16f38d33ed8928eb429f62e2d8b8715336755b92f0ed866bfae974', '[\"*\"]', '2026-02-16 17:51:47', NULL, '2026-02-16 08:21:24', '2026-02-16 17:51:47'),
(56, 'App\\Models\\User', 1, 'auth_token', '40c79658e5ac82b736c8b1f7116af641f0448576551b14d1667d6c98e42277f9', '[\"*\"]', '2026-02-16 18:22:03', NULL, '2026-02-16 08:40:16', '2026-02-16 18:22:03'),
(57, 'App\\Models\\User', 4, 'auth_token', 'e6dcb6bbc387e1d16dd1d3aa1246ca3b7be9c05876d72bdb18ffae0ddcd7f4b3', '[\"*\"]', '2026-02-16 17:46:02', NULL, '2026-02-16 10:11:42', '2026-02-16 17:46:02'),
(58, 'App\\Models\\User', 1, 'auth_token', '3f57a4bbc38b2e83b9d2087953bd323addf194a3e6e604b29d465620879b1032', '[\"*\"]', '2026-02-16 17:38:20', NULL, '2026-02-16 17:29:29', '2026-02-16 17:38:20'),
(59, 'App\\Models\\User', 4, 'auth_token', 'faf2ddb05f13285c9c6c2b3409e2187a22bc9fa2292047ac7d922e59492695d1', '[\"*\"]', '2026-02-17 10:18:23', NULL, '2026-02-16 18:13:40', '2026-02-17 10:18:23'),
(60, 'App\\Models\\User', 1, 'auth_token', '6cc5fa79655fd8b1eabdc083a1aaabe375a5d6edc1647998c48b7c55233b8fe0', '[\"*\"]', '2026-02-17 04:04:45', NULL, '2026-02-16 18:24:48', '2026-02-17 04:04:45'),
(61, 'App\\Models\\User', 1, 'auth_token', 'b838a61d66a62a19d4b05b58b833e82e2f8b0158d49e8925d417ab765cabcc41', '[\"*\"]', '2026-03-02 04:51:26', NULL, '2026-03-01 15:50:27', '2026-03-02 04:51:26'),
(62, 'App\\Models\\User', 1, 'auth_token', 'fca321528f352514257b9a9bb1fde72622e3b6b3176ad1bbaa9b5ca954375443', '[\"*\"]', '2026-03-01 16:51:14', NULL, '2026-03-01 16:11:53', '2026-03-01 16:51:14'),
(63, 'App\\Models\\User', 1, 'auth_token', 'c2197a8a0ad540fdeb0307c4dc3b92644da7fcd461f7657925b77582b7be6092', '[\"*\"]', '2026-03-01 17:26:12', NULL, '2026-03-01 16:42:16', '2026-03-01 17:26:12'),
(64, 'App\\Models\\User', 1, 'auth_token', '7287ab4e87eb7b6bdebac0357b1b5fc70ad6d7ac8e2f8eb2cc45f50648be7a51', '[\"*\"]', '2026-03-02 08:05:02', NULL, '2026-03-02 08:04:59', '2026-03-02 08:05:02'),
(65, 'App\\Models\\User', 4, 'auth_token', '24ff79f16c9a3948dbf0d90f9ddadb7541600ae33b84fb4fc606f9879ecac5c3', '[\"*\"]', '2026-03-05 08:20:47', NULL, '2026-03-05 07:20:33', '2026-03-05 08:20:47'),
(66, 'App\\Models\\User', 1, 'auth_token', '99ab331edb4f4850317a4e85c657d2deb5bcdb071e8aa9fce488101a8b00b7e1', '[\"*\"]', '2026-03-05 16:27:44', NULL, '2026-03-05 16:17:21', '2026-03-05 16:27:44'),
(67, 'App\\Models\\User', 1, 'auth_token', '7c3a9f87d182d2587ecef1cfc71109ef3e0e362f7435478634c7a86be390853d', '[\"*\"]', '2026-03-05 17:47:54', NULL, '2026-03-05 17:39:04', '2026-03-05 17:47:54'),
(68, 'App\\Models\\User', 1, 'auth_token', 'e482a979ad82e8b218a3065a23cab983152cb9161846d2af422160ed3521b6b2', '[\"*\"]', '2026-03-06 04:54:27', NULL, '2026-03-05 18:09:42', '2026-03-06 04:54:27'),
(69, 'App\\Models\\User', 1, 'auth_token', 'a540bc4dd4cdc5225a85bf2895bf1f93de5a7fef8270a796d03cef8988d95fce', '[\"*\"]', '2026-03-06 07:25:15', NULL, '2026-03-06 06:02:41', '2026-03-06 07:25:15'),
(70, 'App\\Models\\User', 1, 'auth_token', '2f4d7090d4ba8703ef93e86c0facf79c286f6a1af61a963a5cdb8104e639bffa', '[\"*\"]', '2026-03-06 08:49:40', NULL, '2026-03-06 06:03:18', '2026-03-06 08:49:40'),
(71, 'App\\Models\\User', 4, 'auth_token', '5c737b5f122de521b29667e3c85194047e354e0a54fa678c39151c9b4f8a9304', '[\"*\"]', '2026-03-06 08:51:49', NULL, '2026-03-06 08:31:24', '2026-03-06 08:51:49'),
(72, 'App\\Models\\User', 4, 'auth_token', '65023a67b1cf450186408166c4655c624cd86d5a581e238828c2aa3247340725', '[\"*\"]', '2026-03-06 09:01:43', NULL, '2026-03-06 09:01:42', '2026-03-06 09:01:43'),
(73, 'App\\Models\\User', 4, 'auth_token', '2fc896bec0f5ee806ff5e550f3740e98c8e7f3c0de54d3c096a6e5332a697213', '[\"*\"]', '2026-03-06 09:02:52', NULL, '2026-03-06 09:02:47', '2026-03-06 09:02:52'),
(74, 'App\\Models\\User', 1, 'auth_token', 'd4685239e2da38791a0d70e7c9c1b02f37d9f07410da0129ab1296cd001650be', '[\"*\"]', '2026-03-07 14:27:32', NULL, '2026-03-07 14:27:19', '2026-03-07 14:27:32'),
(75, 'App\\Models\\User', 1, 'auth_token', 'decb6de0fd9ab4993c0f30e650b82bf7bb70c1c9585106850812803951661b4a', '[\"*\"]', '2026-03-07 17:43:57', NULL, '2026-03-07 15:10:15', '2026-03-07 17:43:57'),
(76, 'App\\Models\\User', 4, 'auth_token', 'a4ea7d3576be9da2573b401e152d6f7765d53f2030ce1358c4d4d94dc7e2136f', '[\"*\"]', '2026-04-05 05:18:42', NULL, '2026-04-05 05:17:44', '2026-04-05 05:18:42'),
(77, 'App\\Models\\User', 4, 'auth_token', 'c63c7ca803ef1a6aac6f88052e925e5fd140fce0fcc19545a1a3018f42f8c263', '[\"*\"]', '2026-05-06 09:29:14', NULL, '2026-05-06 04:12:11', '2026-05-06 09:29:14'),
(78, 'App\\Models\\User', 5, 'auth_token', '00e11ae225f33e5ac461802796ca9c54a39c1ae1f922e49f0365d3ee3ad95429', '[\"*\"]', '2026-05-06 11:50:29', NULL, '2026-05-06 07:16:59', '2026-05-06 11:50:29'),
(79, 'App\\Models\\User', 4, 'auth_token', 'd5aba6585c937b399816819c034565c397ed5de349727cf4d08adc64ae7c2df1', '[\"*\"]', '2026-06-01 14:26:18', NULL, '2026-06-01 14:25:05', '2026-06-01 14:26:18'),
(80, 'App\\Models\\User', 1, 'auth_token', '55391085ed55ddb7c3d89dafbc4630cb55bbdcdbbdaf9609fba265add09c3d6a', '[\"*\"]', '2026-06-01 14:36:29', NULL, '2026-06-01 14:32:56', '2026-06-01 14:36:29'),
(81, 'App\\Models\\User', 4, 'auth_token', '35e039e7b1bbf9279d62c037526ff351dc84d84cbc7318a33f39b36e077ba71e', '[\"*\"]', '2026-08-11 05:40:31', NULL, '2026-08-11 03:32:30', '2026-08-11 05:40:31'),
(82, 'App\\Models\\User', 4, 'auth_token', '2e52b4b3eae4f5e87c78548968d13a4e86768737facfca87c554ec399a8da7ed', '[\"*\"]', '2026-08-11 04:14:08', NULL, '2026-08-11 03:56:13', '2026-08-11 04:14:08'),
(83, 'App\\Models\\User', 4, 'auth_token', '374f66d5195ddd8bda8bcdeccbe77923a32e2d6a8f03628342bf141b968e04af', '[\"*\"]', '2026-08-11 05:45:15', NULL, '2026-08-11 04:22:12', '2026-08-11 05:45:15'),
(84, 'App\\Models\\User', 4, 'auth_token', '5c397869e26289e7d78adb04362be2df6e9c15e6e7a08f0edff304bf8c08c230', '[\"*\"]', '2026-08-11 04:23:41', NULL, '2026-08-11 04:23:40', '2026-08-11 04:23:41'),
(85, 'App\\Models\\User', 4, 'auth_token', '4749b06d9ba9ba483a23ead96bf1c4d54eb6e5064d20b062cfeac9cbcc43adac', '[\"*\"]', '2026-08-12 19:07:58', NULL, '2026-08-12 18:42:48', '2026-08-12 19:07:58'),
(86, 'App\\Models\\User', 4, 'auth_token', '0728943720390974a033cba27effc1e254cd197502a01fee40566c30d2704e6b', '[\"*\"]', '2026-08-16 15:46:27', NULL, '2026-08-16 15:46:26', '2026-08-16 15:46:27'),
(87, 'App\\Models\\User', 4, 'auth_token', 'ca30b890ddd73fbdc29dce79b724a03d6971c4776d4cab02d82fa8447873694b', '[\"*\"]', '2026-08-23 14:52:29', NULL, '2026-08-23 14:52:28', '2026-08-23 14:52:29');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `brand_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `show_price` tinyint(1) NOT NULL DEFAULT '1',
  `stock` int NOT NULL DEFAULT '0',
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nos',
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `datasheet_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_stock',
  `on_store` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `brand_id`, `name`, `slug`, `model_number`, `description`, `price`, `show_price`, `stock`, `unit`, `category`, `brand`, `sku`, `images`, `datasheet_path`, `stock_status`, `on_store`, `created_at`, `updated_at`) VALUES
(14, 7, 'WECON LX3V-0806M / LX3V-1208M Programmable Logic Controller (PLC)', NULL, 'LX3V 0806M/1208M', 'The WECON LX3V-0806M / 1208M PLC is a compact and reliable programmable logic controller designed for industrial automation and machine control applications. It supports ladder programming and instruction list programming with ultra-fast execution speed, ensuring efficient and stable operation.\r\n\r\nThis model includes flexible I/O configurations, built-in communication ports (RS422/RS485), and high-speed pulse output support (transistor models), making it ideal for automation systems, production lines, and control panels.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 8 Input / 6 Output or 12 Input / 8 Output\r\nProgramming: Ladder Diagram & Instruction List\r\nExecution Speed: 0.06 µs (basic instructions)\r\nMemory Capacity: 16K steps\r\nCommunication Ports: RS422 / RS485\r\nHigh-speed pulse output (transistor models)\r\nExternal Interrupt: 6 channels\r\nTimer Interrupt: 3 channels\r\nOperating Temperature: 0°C to 55°C\r\nStorage Temperature: -20°C to 70°C\r\nHumidity: 5% – 85% RH (non-condensing)\r\nPower Supply Options:\r\nAC: 85–265V\r\nDC: 24V ±10%\r\nCompact design with industrial-grade durability', 0.00, 1, 5, 'PCS', 'PLC', 'Wecon', 'LX3V 0806M/1208M', '[\"\\/products\\/1778044169_69facd09bdf19_Screenshot 2026-05-06 102752.png\"]', '/datasheets/1778044169_datasheet_67e24dfd014b7.pdf', 'in_stock', 1, '2026-05-06 05:09:29', '2026-05-06 05:24:07'),
(15, 7, 'WECON LX3V-1212M / LX3V-1412M Programmable Logic Controller (PLC)', NULL, 'LX3V-1212M / LX3V-1412M', 'The WECON LX3V-1212M / 1412M PLC is a high-performance programmable logic controller designed for industrial automation and machine control applications. It provides reliable operation with fast processing speed and flexible I/O configurations.\r\n\r\nThis PLC supports both ladder diagram and instruction list programming, and includes built-in RS422/RS485 communication interfaces. Transistor models support high-speed pulse output, making it suitable for motion control and high-speed automation tasks.\r\n\r\nKey Features:\r\n\r\nI/O Configuration:\r\nLX3V-1212M: 12 Input / 12 Output\r\nLX3V-1412M: 14 Input / 12 Output\r\nProgramming: Ladder Diagram & Instruction List\r\nExecution Speed: 0.06 µs (basic instructions)\r\nMemory Capacity: 16K steps\r\nCommunication Ports: RS422 / RS485\r\nHigh-speed pulse output (transistor models)\r\nExternal Interrupt: 6 channels\r\nTimer Interrupt: 3 channels\r\nOperating Temperature: 0°C to 55°C\r\nStorage Temperature: -20°C to 70°C\r\nHumidity: 5% – 85% RH (non-condensing)\r\nPower Supply Options:\r\nAC: 85–265V\r\nDC: 24V ±10%\r\nDurable industrial design with high noise immunity', 0.00, 1, 5, 'PCS', 'PLC', 'Wecon', 'LX3V-1212M / LX3V-1412M', '[\"\\/products\\/1778045218_69fad1225d61e_Screenshot 2026-05-06 104335.png\"]', '/datasheets/1778045218_datasheet_67e24dfd014b7.pdf', 'in_stock', 1, '2026-05-06 05:26:58', '2026-05-06 05:27:17'),
(16, 7, 'WECON LX3V-1616M / LX3V-2416M Programmable Logic Controller (PLC)', NULL, 'LX3V-1616M / LX3V-2416M', 'The WECON LX3V-1616M / 2416M PLC is a high-performance, compact controller designed for complex industrial automation and high-speed machine control. It features an upgraded I/O density compared to smaller models, supporting 32 to 40 total I/O points to handle more demanding production line environments.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 16 Input / 16 Output (1616M) or 24 Input / 16 Output (2416M).\r\n\r\nProgramming: Supports Ladder Diagram (LD) and Instruction List (IL).\r\n\r\nExecution Speed: Ultra-fast 0.06 µs for basic instructions; 1–10 µs for applied instructions.\r\n\r\nMemory & Storage: 16K steps system storage with FLASH memory.\r\n\r\nCommunication: Dual Serial Ports (COM1: RS422 or RS485; COM2: RS485) and Mini USB/Serial programming support.\r\n\r\nExpansion: Supports BD Board and Module expansion.\r\n\r\nPulse Output: Up to 4 channels of high-speed pulse output (model dependent).\r\n\r\nInterrupts: 6 External Interrupt channels and 3 Timer Interrupt channels.\r\n\r\nDurability: JIS C 0040 Standard shock resistance and IEC61000-4-4 noise immunity.\r\n\r\nPower Supply: AC (85–265V) or DC (24V ±10%) options.', 0.00, 1, 4, 'PCS', 'PLC', 'Wecon', 'LX3V-1616M / LX3V-2416M', '[\"\\/products\\/1778046871_69fad79798cc6_01.png\"]', '/datasheets/1778046871_datasheet_67e24dfd014b7.pdf', 'in_stock', 1, '2026-05-06 05:54:31', '2026-05-06 05:59:24'),
(17, 7, 'WECON LX3V-2424M / LX3V-3624M Programmable Logic Controller (PLC)', NULL, 'LX3V-2424M / LX3V-3624M', 'The WECON LX3V-2424M / 3624M PLC is a high-capacity, expandable programmable logic controller designed for advanced industrial automation and extensive machine control applications. It supports ladder programming and instruction list programming with an ultra-fast execution speed of 0.06 µs, ensuring efficient and stable operation.\r\nThis series offers a high density of built-in I/O (up to 60 points) and supports further expansion via modules and BD boards. It includes dual communication ports (RS422/RS485), multi-channel high-speed pulse output (transistor models), and comprehensive interrupt capabilities, making it ideal for complex production lines, automation systems, and larger control panels.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 24 Input / 24 Output (LX3V-2424M series) or 36 Input / 24 Output (LX3V-3624M series).\r\n\r\nProgramming: Supports Instruction List (IL) and Ladder Diagram (LD).\r\n\r\nExecution Speed: Basic Instructions: 0.06 µs; Applied Instructions: 1–10 µs.\r\n\r\nMemory: 16K System Storage with FLASH memory.\r\n\r\nExpansion: Supports Module and BD Board expansion (2 slots).\r\n\r\nCommunication Ports: COM1: RS422 or RS485; COM2: RS485.\r\n\r\nHigh-Speed Pulse Output (Transistor): Up to 4 channels (model dependent).\r\n\r\nInterrupts: 6 External Interrupt channels; 3 Timer Interrupt channels.\r\n\r\nEnvironmental Ratings: Operating Temp: 0°C to 55°C; Storage Temp: -20°C to 70°C; Humidity: 5%–85% RH (non-condensing).\r\n\r\nDurability: JIS C 0040 Standard shock resistance; IEC61000-4-4 noise immunity.\r\n\r\nPower Supply Options: AC: 85–265V or DC: 24V ±10%.\r\n\r\nOutputs: Relay (2A resistive load) or Transistor (0.5A resistive load per point).', 0.00, 1, 4, 'PCS', 'PLC', 'Wecon', 'LX3V-2424M / LX3V-3624M', '[\"\\/products\\/1778047147_69fad8ab12570_2.png\"]', '/datasheets/1778047147_datasheet_67e24dfd014b7.pdf', 'in_stock', 1, '2026-05-06 05:59:07', '2026-05-06 05:59:30'),
(18, 7, 'WECON AC60 Series High-performance Medium-size Controller (PLC)', NULL, 'AC60-0808MT', 'The WECON AC60 is a high-performance, medium-size Programmable Logic Controller based on the CODESYS platform. Engineered for advanced industrial automation and sophisticated motion control, it features a powerful 4-core 1.8GHz CPU for superior program execution speeds. The blade-structure design allows for flexible expansion while saving space.\r\n\r\nThe AC60 series offers standard Ethernet connectivity and supports multi-protocol communication, seamless project development following PLCopen2.0 standards, and effortless operation & maintenance via remote debugging in the V-NET System.\r\n\r\nKey Features:\r\n\r\nPlatform: Based on the CODESYS platform.\r\n\r\nCPU: 4-core 1.8GHz CPU (on supported models -DB, -DC, -DD).\r\n\r\nI/O Configuration (Local): 8 Digital Inputs (PNP/NPN) / 8 Digital Outputs (NPN).\r\n\r\nProgram Space: Program Capacity: 50MB; Variable Capacity: 10MB; Power-down Latch: 1MB.\r\n\r\nProgramming Languages: LD, IL, FBD, CFC, SFC, ST.\r\n\r\nEthernet Communication: Gigabit-capable (1000Mbps/100Mbps/10Mbps), max 128 connections/sockets/clients/servers.\r\n\r\nEtherNet/IP: Max connections 128.\r\n\r\nEtherCAT (Motion): Supports up to 256 slaves. Synchronisation cycle: 1ms for 16 axis (up to 64 axes total).\r\n\r\nUSB: 1 channel TYPE-C (USB 2.0) for calibration, IP setting, etc.\r\n\r\nSerial: 2 channels RS485 (Half duplex), max baud rate 115200 bps, max 31 slaves. Supports Modbus RTU/ASCII.\r\n\r\nHigh Speed Input: 4 Channels, max 200KHz.\r\n\r\nHigh Speed Output: 4 Channels, max 200KHz.\r\n\r\nExpansion: Compatible with LX6V series expansion modules (up to 32 modules).\r\n\r\nOther Features: Optional TF card, Motion Control, OPC UA Server (supported models), WebVisu (supported models), Robotic control (supported models).\r\n\r\nPower Supply: DC 24V±10%, 1A (with short circuit/reverse protection).\r\n\r\nSoftware: WECSVS (Standard IEC 61131-3).', 0.00, 1, 3, 'PCS', 'PLC', 'Wecon', 'AC60-0808MT', '[\"\\/products\\/1778047723_69fadaeb178c6_Screenshot 2026-05-06 113654.png\"]', '/datasheets/1778047723_datasheet_6890066885d29.pdf', 'in_stock', 1, '2026-05-06 06:08:43', '2026-05-06 06:09:01'),
(19, 7, 'WECON LX5V-1412MT Programmable Logic Controller (PLC)', NULL, 'LX5V-1412MT', 'The WECON LX5V-1412MT is a high-performance programmable logic controller featuring a significant boost in processing speed and memory over standard models. It is designed for precision industrial automation, supporting advanced motion control features like E-CAM and high-speed pulse outputs.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 14 Input / 12 Output (Total 26 points)\r\n\r\nOutput Type: Transistor (NPN)\r\n\r\nExecution Speed: 0.01-0.03 µs for basic instructions.\r\n\r\nSystem Storage: 512KB\r\n\r\nProgramming: Ladder Diagram & Instruction List\r\n\r\nPulse Output: 4 channels at 200KHz\r\n\r\nHigh-speed Counter: 4 channels at 150KHz (single phase) or 100KHz (AB phase)\r\n\r\nMemory & Storage: 16K steps system storage with FLASH memory.\r\n\r\nCommunication: 2x RS485 ports and 1x RS422 port\r\n\r\nExternal Interrupts: Support for X0-X7 (rising and falling edges)\r\n\r\nTimer Interrupts: 100 Channels with a minimum interruption time of 0.1ms.\r\n\r\nOperating Temperature: 0°C to 55°C\r\n\r\nPower Supply: AC (85–265V) or DC (24V ±10%) options.', 0.00, 1, 3, 'PCS', 'PLC', 'Wecon', 'LX5V-1412MT', '[\"\\/products\\/1778049611_69fae24b11473_Screenshot 2026-05-06 114957.png\"]', '/datasheets/1778049611_datasheet_67e247e881fb5.pdf', 'in_stock', 1, '2026-05-06 06:40:11', '2026-05-06 06:41:10'),
(20, 7, 'WECON LX5V-1616MT / LX5V-2416MT Programmable Logic Controller (PLC)', NULL, 'LX5V-1616MT/2416MT(A/D)', 'The WECON LX5V-1616MT/2416MT is an advanced, high-speed PLC designed for high-precision motion control and complex industrial automation. It features enhanced I/O density and supports E-CAM with 8 channels of high-speed pulse output, making it ideal for multi-axis machinery.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 16 Input / 16 Output or 24 Input / 16 Output\r\n\r\nProgramming: Instruction List & Ladder Diagram\r\n\r\nExecution Speed: 0.01–0.03 µs for basic instructions\r\n\r\nSystem Storage: 512KB\r\n\r\nPulse Output: 8 channels at 200kHz\r\n\r\nHigh-speed Input: 8 channels at 150kHz (Single) or 100kHz (AB Phase)\r\n\r\nCommunication: RS422/RS485 and dedicated RS485 ports\r\n\r\nSpecial Functions: Supports E-CAM and up to 2 BD Boards\r\n\r\nOperating Temperature: 0°C to 55°C\r\n\r\nPower Supply Options: AC (85–265V) or DC (24V ±10%)', 0.00, 1, 5, 'pcs', 'PLC', 'Wecon', 'LX5V-1616MT/2416MT(A/D)', '[\"\\/products\\/1778050087_69fae42720f8a_Screenshot 2026-05-06 121230.png\"]', '/datasheets/1778050087_datasheet_67e247e881fb5.pdf', 'in_stock', 1, '2026-05-06 06:48:07', '2026-05-06 06:48:45'),
(21, 7, 'WECON LX5V-2424MT / LX5V-3624MT Programmable Logic Controller (PLC)', NULL, 'LX5V-2424MT / LX5V-3624MT', 'The WECON LX5V-2424MT/3624MT is a high-density, high-performance PLC designed for large-scale industrial automation. Part of the advanced LX5V series, it offers ultra-fast processing speeds and high I/O counts, combined with sophisticated motion control capabilities like E-CAM and 8-channel high-speed pulse output.\r\n\r\nKey Features:\r\n\r\nI/O Configuration: 24 Input / 24 Output or 36 Input / 24 Output\r\n\r\nOutput Type: Transistor (NPN)\r\n\r\nExecution Speed: 0.01–0.03 µs for basic instructions\r\n\r\nMemory/Storage: 512KB System Storage\r\n\r\nProgramming: Instruction List and Ladder Diagram\r\n\r\nPulse Output: 8 channels at 200kHz (ideal for 8-axis control)\r\n\r\nHigh-Speed Input: 8 channels at 150kHz (Single) or 100kHz (AB Phase)\r\n\r\nCommunication: 2x RS485 and 1x RS422 ports; Micro USB for monitoring\r\n\r\nExpansion: Supports BD boards (up to 2) and expansion modules\r\n\r\nOperating Temp: 0°C to 55°C\r\n\r\nPower Supply: AC 85–265V or DC 24V ±10%', 0.00, 1, 8, 'PCS', 'PLC', 'Wecon', 'LX5V-2424MT / LX5V-3624MT', '[\"\\/products\\/1778050501_69fae5c520121_Screenshot 2026-05-06 122033.png\"]', '/datasheets/1778050501_datasheet_67e247e881fb5.pdf', 'in_stock', 1, '2026-05-06 06:55:01', '2026-05-06 06:55:41'),
(22, 7, 'WECON LX6S-0808MT High-Performance EtherCAT PLC', NULL, 'LX6S-0808MT-DA / LX6S-0808MT-DB', 'The WECON LX6S-0808MT is a next-generation high-performance controller designed for sophisticated motion control applications. It features built-in EtherCAT support for controlling up to 16 servo axes and offers ultra-fast execution speeds down to 0.01 µs .With a massive 5M program capacity and support for multiple programming languages including ST and SFC, it provides the flexibility needed for modern, complex industrial systems. \r\n\r\nKey Features:\r\n\r\nI/O Configuration: 8 Digital Input / 8 Digital Output  \r\n\r\nOutput Type: Transistor  \r\n\r\nMotion Control: Built-in EtherCAT supporting 8 or 16 servo axes  \r\n\r\nProgramming: LD (Ladder), ST (Structured Text), and SFC (Sequential Function Chart)  \r\n\r\nExecution Speed: 0.01 to 0.02 µs for basic instructions  \r\n\r\nProgram Capacity: 5M  \r\n\r\nHigh-Speed Pulse Output: 4 channels / 200kHz\r\n\r\nCommunication: 100M Ethernet, Dual RS485 (COM1/COM2), and USB Type-C for programming/monitoring  \r\n\r\nStorage: TF Card support for data logging and expanded storage  \r\n\r\nOperating Temperature:  0°C to 55°C\r\n\r\nPower Supply: DC', 0.00, 1, 5, 'pcs', 'PLC', 'Wecon', 'LX6S-0808MT-DA / LX6S-0808MT-DB', '[\"\\/products\\/1778051323_69fae8fb6a626_6s.png\"]', '/datasheets/1778051323_datasheet_6s.pdf', 'in_stock', 1, '2026-05-06 07:08:43', '2026-05-06 07:10:14'),
(23, 7, 'WECON LX6V-0808MT High-Performance EtherCAT PLC', NULL, 'LX6V-0808MT-DB  / LX6V-0808MT-DD / LX6V-0808MT-DE', 'The WECON LX6V-0808MT is a high-performance programmable logic controller optimized for large-scale motion control systems. Featuring a Gigabit Ethernet interface and built-in EtherCAT support, it can manage up to 128 servo axes with exceptional precision. With an ultra-fast execution time of 0.01 - 0.02 µs and a 5M program capacity, it is designed to handle the most demanding industrial automation tasks, including high-speed pulse output and complex function blocks (FB/FC). \r\n\r\nKey Features:\r\n\r\nI/O Configuration: 8 Digital Input / 8 Digital Output  \r\n\r\nOutput Type: Transistor  \r\n\r\nMotion Control: Built-in EtherCAT supporting up to 128 servo axes  \r\n\r\nExecution Speed: 0.01 - 0.02 µs for basic instructions  \r\n\r\nProgram Capacity: 5M  \r\n\r\nProgramming: Instruction Table, Ladder Diagram, FB, and FC  \r\n\r\nConnectivity: Gigabit Ethernet, Dual RS485 ports, and USB Type-C for programming/monitoring  \r\n\r\nHigh-Speed I/O: 4-channel pulse output (200kHz) and 8-channel high-speed single input (150kHz)\r\n\r\nAdvanced Interrupts: 100 channels for timer 0.1ms and high-speed counter interrupts  \r\n\r\nStorage: Integrated TF Card support \r\n\r\nEnvironmental: Operating temperature 0°C to 55°C industrial-grade immunity (IEC61000-4-4)', 0.00, 1, 8, 'pcs', 'PLC', 'Wecon', 'LX6V-0808MT-DB  / LX6V-0808MT-DD / LX6V-0808MT-DE', '[\"\\/products\\/1778052171_69faec4be968e_6v.png\"]', '/datasheets/1778052171_datasheet_6v.pdf', 'in_stock', 1, '2026-05-06 07:22:51', '2026-05-06 07:24:50'),
(24, NULL, 'Relay base', NULL, 'PLC-BSC- 24DC/21HC', 'The PHOENIX CONTACT part 2967772 is a 14 mm PLC basic terminal block designed specifically for high continuous currents. It features a screw connection for strong and secure connections. This terminal block does not include a relay or solid-state relay. It is suitable for mounting on DIN rail NS 35/7.5 and has 1 PDT (single pole, double throw) configuration. The input voltage for this terminal block is 24 V DC.', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', 'PLC-BSC- 24DC/21HC', '[\"\\/products\\/1778053031_69faefa7ccb49_12156320.jpg\"]', '/datasheets/1778053031_datasheet_Phoenix Relay Base.pdf', 'in_stock', 1, '2026-05-06 07:37:11', '2026-05-06 07:37:42'),
(30, 14, 'Single relay', NULL, '2961105', 'RIFLINE Complete is Phoenix Contact\'s new cost effective modular ice cube relay series. The relays range from a slim 6.2 mm coupling relay to a small power contactor replacement. The most powerful relay can switch voltages up to 440 V. Mounting Type Through Hole Coil Voltage 24VDC Contact Form SPDT (1 Form C) Contact Rating (Current) 6A Switching Voltage 250VAC, 250VDC - Max Coil Type Non Latching Termination Style PC Pin Operate Time 5ms Release Time 2.5ms Operating Temperature -40°C ~ 85°C', 0.00, 1, 4, 'pcs', 'Relay', 'PHOENIX CONTACT', '2961105', '[\"\\/products\\/1778053760_69faf280e789f_relay.jpg\"]', '/datasheets/1778053760_datasheet_ph-2961105 relay.pdf', 'in_stock', 1, '2026-05-06 07:49:20', '2026-05-06 07:51:47'),
(31, 14, 'Plug-in bridge', NULL, '3030352', 'Plug-in bridge - pitch: 4.2 mm - number of positions: 20 - color: red', 0.00, 1, 5, 'pcs', 'Connectors', 'PHOENIX CONTACT', '3030352', '[\"\\/products\\/1778055154_69faf7f293253_Connectors Red.jpg\"]', '/datasheets/1778055154_datasheet_3030352 red.pdf', 'in_stock', 1, '2026-05-06 08:12:34', '2026-05-06 08:12:48'),
(32, 14, 'Plug-in bridge', NULL, '3030353', 'Plug-in bridge - pitch: 4.2 mm - number of positions: 20 - color: blue', 0.00, 1, 6, 'pcs', 'Connectors', 'PHOENIX CONTACT', '3030353', '[\"\\/products\\/1778055432_69faf90873170_44020610 blue.jpg\"]', '/datasheets/1778055432_datasheet_3030353.pdf', 'in_stock', 1, '2026-05-06 08:17:12', '2026-05-06 08:17:23'),
(33, 7, 'WECON PI8150ig Series 15\" High-Performance HMI', NULL, 'PI8150ig', 'The WECON PI8150ig is a premium 15-inch Human Machine Interface designed for high-end industrial visualization and IIoT connectivity. Featuring a crisp 1920 X 1080 resolution and a durable aluminum-metal shell, this HMI supports advanced V-Net functions, including remote monitoring, cloud data update, and MQTT protocol. It is equipped with a high-performance CPU and extensive communication options like Ethernet, CANopen, and optional 4G or Wi-Fi for seamless factory integration.\r\n\r\nKey Features:\r\n\r\nDisplay: 15\" TFT Screen with 1920 X 1080 resolution and 250 cd/m2 brightness \r\n\r\nTouch Panel: High-precision four-wire resistive touch  \r\n\r\nMemory: 512MB RAM and 4GB Flash storage; supports TF cards  \r\n\r\nConnectivity: Built-in Ethernet, USB Host/Client, and multiple Serial ports (RS232/RS422/RS485)\r\n\r\nIIoT Ready: Supports MQTT, Lua Script, Remote Control, and Email Alarms  \r\n\r\nNetworking Options: Available with standard Ethernet, 4G (Global/Local), or Wi-Fi depending on model  \r\n\r\nMultimedia: Supports IP Camera integration, Audio Output, and Video Player  \r\n\r\nDurability: IP65 rated front panel with an aluminum + metal shell\r\n\r\nOperating Temp: 0°C to 50°C\r\n\r\nPower: 24V DC ( Input range 18 - 28V )', 0.00, 1, 3, 'PCS', 'HMI', 'Wecon', 'PI8150ig', '[\"\\/products\\/1778055888_69fafad025c7a_15555.png\",\"\\/products\\/1778056239_69fafc2f0d7e9_155555.png\"]', '/datasheets/1778055888_datasheet_1.pdf', 'in_stock', 1, '2026-05-06 08:24:48', '2026-05-06 08:31:29'),
(34, 7, 'WECON PI8043ig Series 4.3\" High-Performance HMI', NULL, 'PI8043ig', 'The WECON PI8043ig is a compact and versatile 4.3-inch Human Machine Interface designed for efficient machine control and IIoT connectivity. Despite its small footprint, it features a high-performance CPU, 4GB of flash storage, and advanced V-Net functions like MQTT, Lua Scripting, and remote monitoring via Cloud or APP. It is built for industrial reliability with an IP65-rated front panel and wide operating temperature range, making it a powerful choice for modern control panels.\r\n\r\nKey Features:\r\n\r\nDisplay: 4.3\" screen with 480 X 272 resolution and 300 cd/m2 brightness.\r\n\r\nTouch Panel: High-precision four-wire resistive touch.\r\n\r\nMemory: 512MB RAM and 4GB Flash storage.\r\n\r\nConnectivity: Integrated Ethernet port, USB 2.0 Host or USB Type-C (cannot be used simultaneously).  \r\n\r\nSerial Ports: Support for RS232, RS422, and RS485.  \r\n\r\nIIoT Functions: Supports MQTT, Lua Script, Remote Update, and Email Alarms.  \r\n\r\nNetwork Options: Available in standard Ethernet, 4G, or Wi-Fi versions.\r\n\r\nEnvironment: Durable plastic/ABS shell with a working temperature range of - 10°C to 55°C', 0.00, 1, 4, 'pcs', 'HMI', 'Wecon', 'PI8043ig', '[\"\\/products\\/1778056970_69faff0a6ac17_16666.jpg\",\"\\/products\\/1778057048_69faff588d1af_166666.png\"]', '/datasheets/1778056970_datasheet_2.pdf', 'in_stock', 1, '2026-05-06 08:42:50', '2026-05-06 08:44:18'),
(35, 7, 'WECON PI8070ig Series 7\" High-Performance HMI', NULL, 'PI8070ig', 'The WECON PI8070ig is a high-performance 7-inch Human Machine Interface designed for versatile industrial automation and IIoT connectivity. Featuring a bright TFT display and a high-performance CPU, it supports advanced V-Net functions such as MQTT, Lua scripting, and remote monitoring via Cloud or mobile APP. Its robust design includes an IP65-rated front panel and multiple communication ports, making it an ideal central hub for machine control and data management.\r\n\r\nDisplay: 7\" TFT screen with 800 X 480 resolution and 250 cd/m2 brightness \r\n\r\nTouch Panel: High-precision four-wire resistive touch  \r\n\r\nMemory: 512MB RAM and 4GB Flash storage with SD card slot support  \r\n\r\nCommunication: Integrated Ethernet, USB 2.0 Host/Client, and multiple serial ports (RS232/RS422/RS485)  \r\n\r\nIIoT Functions: Supports MQTT, Lua script, Cloud monitoring, and Email alarms  \r\n\r\nNetwork Options: Available in standard Ethernet, 4G, or Wi-Fi versions  \r\n\r\nDurability: IP65-rated front panel with a working temperature range of 10°C to 55°C\r\n\r\nPower Supply: 24V DC (Input range 12 - 28V ) with power consumption < 10W', 0.00, 1, 4, 'PCS', 'HMI', 'Wecon', 'PI8070ig', '[\"\\/products\\/1778057787_69fb023b127c3_17777.jpg\",\"\\/products\\/1778057863_69fb02871564d_177777.png\"]', '/datasheets/1778057787_datasheet_3.pdf', 'in_stock', 1, '2026-05-06 08:56:27', '2026-05-06 09:02:45'),
(36, 7, 'WECON PI8102ig Series 10.1\" High-Performance HMI', NULL, 'PI8102ig', 'The WECON PI8102ig is a professional 10.1-inch Human Machine Interface engineered for high-visibility industrial applications and robust IIoT connectivity. It features a large 1024 X 600 resolution TFT display with 350 cd/m2 brightness, making it ideal for detailed process monitoring. With a high-performance CPU, 4GB of flash storage, and advanced V-Net functions, it supports modern factory requirements like MQTT, Lua scripting, and secure remote access.\r\n\r\nKey Features:\r\n\r\nDisplay: 10.1\" TFT screen with 1024 X 600 resolution and 350 cd/m2 brightness.\r\n\r\nTouch Panel: High-precision four-wire resistive touch.\r\n\r\nMemory: 512 MB RAM and 4 GB Flash storage with SD card slot support.\r\n\r\nConnectivity: Integrated Ethernet (x1), USB 2.0 Host + Client (non-simultaneous use), and versatile serial ports (RS232/RS422/RS485).\r\n\r\nIIoT Integration: Supports Cloud SCADA, MQTT, Lua Scripting, and WVPN for secure remote control.\r\n\r\nNetworking Options: Available in standard Ethernet, 4G (G model), or WIFI (W model) configurations.\r\n\r\nDurability: IP65- rated front panel with a working temperature range of 10°C to 55°C\r\n\r\nPower Supply: 24V DC (Input range 12 - 28V) with low power consumption under 10W.', 0.00, 1, 5, 'PCS', 'HMI', 'Wecon', 'PI8102ig', '[\"\\/products\\/1778058845_69fb065d6b2ef_18888.jpg\",\"\\/products\\/1778058909_69fb069d98f6c_18888888.png\"]', '/datasheets/1778058845_datasheet_4.pdf', 'in_stock', 1, '2026-05-06 09:14:05', '2026-05-06 09:15:27'),
(37, 14, 'Plug-in miniature solid-state relay', NULL, '5603260', 'The 5603260 is PLC-INTERFACE, consisting of DIN rail-mountable basic terminal block with screw connection and plug-in miniature solid-state relay, input: 24 V DC, output: 3 ... 33 V DC/3 A, UL/cUL: approved for use in Ex Zone Class I, Div. 2.', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', '5603260', '[\"\\/products\\/1778059149_69fb078d3ae8c_12160517.jpg\"]', '/datasheets/1778059149_datasheet_5603260.pdf', 'in_stock', 1, '2026-05-06 09:19:09', '2026-05-06 09:19:24'),
(38, 7, 'WECON PI8070ig(N) 7\" High-Performance HMI', NULL, 'PI8070ig(N)', 'The WECON PI8070ig(N) is an advanced 7-inch Human Machine Interface powered by a Quad-core high-performance CPU. Designed for seamless industrial connectivity, it features dual Ethernet ports and supports IP camera integration. This HMI offers versatile project management with multiple download methods, including USB, LAN, and remote options, backed by 4GB of Flash and 512MB of RAM for complex industrial applications.\r\n\r\nKey Features:\r\n\r\nCPU & Memory: Quad-core high-performance processor with 4GB Flash and 512MB RAM.\r\n\r\nDisplay: 7\" screen with 800 X 480 resolution.\r\n\r\nConnectivity: Equipped with 2 Ethernet ports and support for IP Cameras.\r\n\r\nSerial Interfaces: COM1 supporting RS232, RS422/RS485, and a dedicated RS485 port.\r\n\r\nFlexible Programming: Supports downloading via USB cable, USB flash drive, LAN, and remote download.\r\n\r\nIndustrial Design: Built for reliability in automated environments with standard certifications.', 0.00, 1, 6, 'pcs', 'HMI', 'Wecon', 'PI8070ig(N)', '[\"\\/products\\/1778059250_69fb07f2e280d_5.1.png\",\"\\/products\\/1778059250_69fb07f2e2a51_5.2.png\"]', NULL, 'in_stock', 1, '2026-05-06 09:20:50', '2026-05-06 09:21:06'),
(39, 14, 'convenient push-in connection and a plug-in miniature relay', NULL, '2900315', 'The PHOENIX CONTACT part 2900315 is a PLC-INTERFACE designed for input functions. It includes a PLC-BPT.../SEN basic terminal block with a convenient push-in connection and a plug-in miniature relay featuring multi-layer gold contacts. This component is designed for easy mounting on a DIN rail NS 35/7,5 and features 1 N/O contact. It is compatible with input voltage of 230 V AC/220 V DC, making it ideal for a variety of industrial applications.', 0.00, 1, 7, 'pcs', 'Relay', 'PHOENIX CONTACT', '2900315', '[\"\\/products\\/1778059551_69fb091fb8bb1_43378094.jpg\"]', '/datasheets/1778059551_datasheet_2900315.pdf', 'in_stock', 1, '2026-05-06 09:25:51', '2026-05-06 09:26:21'),
(40, 7, 'WECON PI8101ig(N) 10.1\" High-Performance HMI', NULL, 'PI8101ig(N)', 'The WECON PI8101ig(N) is a high-end 10.1-inch Human Machine Interface powered by a Quad-core high-performance CPU. Designed for advanced industrial networking, it features dual Ethernet ports and supports sophisticated project management through multiple download methods including LAN and remote access. With a crisp 1024 X 600 resolution and substantial 4GB Flash memory, it provides a powerful platform for data-intensive automation and visualization.\r\n\r\nKey Features:\r\n\r\nCPU & Memory: Quad-core high-performance processor with 4GB Flash and 512MB RAM memory.\r\n\r\nDisplay: 10.1\" widescreen display with 1024 X 600 resolution.\r\n\r\nNetworking: Dual Ethernet ports for flexible network architecture.\r\n\r\nInterfaces: COM1 supports RS232 and RS422/RS485; additional dedicated RS485 port available.\r\n\r\nProject Deployment: Supports USB cable, USB flash drive, LAN, and remote download methods.\r\n\r\nIndustrial Grade: CE and FCC certified with a rugged enclosure design.', 0.00, 1, 9, 'PCS', 'HMI', 'Wecon', 'PI8101ig(N)', '[\"\\/products\\/1778059559_69fb092783bf2_6.1.jpg\",\"\\/products\\/1778059559_69fb092783e2a_6.2.png\"]', NULL, 'in_stock', 1, '2026-05-06 09:25:59', '2026-05-06 09:26:18'),
(41, 7, 'WECON PI8121ig(N) 12\" High-Performance HMI', NULL, 'PI8121ig(N)', 'The WECON PI8121ig(N) is a high-performance 12-inch Human Machine Interface designed for advanced industrial visualization and complex automation control. Powered by a Quad-core high-performance CPU with 512MB RAM and 4GB Flash memory, it provides the processing power required for data-heavy applications. It features a high-resolution 1024 X 768 display and versatile connectivity options, including dual Ethernet ports and multiple serial interfaces, ensuring seamless integration into modern IIoT environments.\r\n\r\nKey Features:\r\n\r\nDisplay: 12-inch screen with a crisp 1024 X 768 resolution.\r\n\r\nCPU & Memory: Quad-core high-performance CPU with 4GB Flash and 512MB RAM.\r\n\r\nConnectivity: Equipped with dual Ethernet ports for flexible networking.\r\n\r\nSerial Interfaces: COM1 supports RS232 and RS422/RS485; additional dedicated RS485 port.\r\n\r\nFlexible Deployment: Supports project downloads via USB cable, USB flash drive, LAN, and remote download.\r\n\r\nReliability: Industrial-grade hardware designed for stability in demanding environments.', 0.00, 1, 2, 'pcs', 'HMI', 'Wecon', 'PI8121ig(N)', '[\"\\/products\\/1778059745_69fb09e1be0c6_7.1.png\"]', NULL, 'in_stock', 1, '2026-05-06 09:29:05', '2026-05-06 09:29:14'),
(42, 14, 'Preassembled relay modules with spring-cage connection', NULL, 'PR2-RSP3-LV-230AC/2X21', 'Preassembled relay modules with spring-cage connection, consisting of a relay base, industrial relay with integrated LED and engage/disengage manual actuate lever, varistor protective module, and retaining bracket. Input voltage: 230 V AC, two PDTs, 10 A', 0.00, 1, 6, 'pcs', 'Relay', 'PHOENIX CONTACT', 'PR2-RSP3-LV-230AC/2X21', '[\"\\/products\\/1778063553_69fb18c1582a3_48430123.jpg\"]', '/datasheets/1778063553_datasheet_2834711.pdf', 'in_stock', 1, '2026-05-06 10:32:33', '2026-05-06 10:33:08'),
(43, 14, 'PLC-INTERFACE, consisting of PLC-BSP.../21 basic terminal block with spring-cage connection and plug-in miniature relay', NULL, 'PLC-RSP- 24DC/21AU', 'PLC-INTERFACE, consisting of PLC-BSP.../21 basic terminal block with spring-cage connection and plug-in miniature relay with multi-layer gold contact, for mounting on DIN rail NS 35/7,5, 1 PDT, input voltage 24 V DC', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', 'PLC-RSP- 24DC/21AU', '[\"\\/products\\/1778063789_69fb19ad6d8de_48434372.jpg\"]', '/datasheets/1778063789_datasheet_pdf.dolineitemtypelineitemuid2966540.dolineitemtypelineitemuid296.pdf', 'in_stock', 1, '2026-05-06 10:36:29', '2026-05-06 10:36:40'),
(44, 14, 'Electromechanical Relay 24VDC', NULL, '2967361', 'Electromechanical Relay 24VDC 2.67KOhm 6A SPST-NO (6.2x80x94)mm DIN Rail PLC Relay', 0.00, 1, 6, 'pcs', 'Relay', 'PHOENIX CONTACT', '2967361', '[\"\\/products\\/1778064117_69fb1af5165b5_12156279.jpg\"]', '/datasheets/1778064117_datasheet_2967361.pdf', 'in_stock', 1, '2026-05-06 10:41:57', '2026-05-06 10:42:15'),
(45, 14, 'Surge protective device - single channel', NULL, 'VAL-US-120/65/1+0-FM', 'The 2910356 is a Type 1/2 surge protective device for two-channel, 120V AC power systems. It operates with a maximum continuous voltage (MCOV) of 175V AC (L-N) and 264V AC (N-G). This SPD provides a UL-rated nominal discharge current (In) of 20 kA and can handle a maximum surge current of 65 kA per phase. Key features include a high short-circuit current rating (SCCR) of 200 kA, a pluggable two-section design for 35 mm DIN rail mounting, and both optical and remote contact signaling for fault indication. Its robust design and high ratings make it suitable for protecting sensitive equipment in TN-S and TT power distribution systems.', 0.00, 1, 5, 'pcs', 'Circuit Breaker', 'PHOENIX CONTACT', 'VAL-US-120/65/1+0-FM', '[\"\\/products\\/1778066029_69fb226d3592b_50083770.jpg\"]', '/datasheets/1778066029_datasheet_pgurl_2910355.pdf', 'in_stock', 1, '2026-05-06 11:13:49', '2026-05-06 11:18:30'),
(46, 14, 'Surge protective device - four channel', NULL, 'VAL-US-277/40/3+1-FM', 'The PHOENIX CONTACT VAL-US-277/40/3+1-FM is a surge protective device specifically designed to protect electrical systems operating at 277/480 V AC. This four-channel device offers reliable surge protection for both power and communication lines, ensuring the safety and preventing system failures caused by overvoltage events.Featuring a convenient remote indicator contact, this surge protective device provides users with instant feedback on its operational status. With its 4-wire plus ground configuration, the VAL-US-277/40/3+1-FM offers comprehensive protection against surges for various system components, including control panels, data communication equipment, and more.Designed by the trusted and renowned manufacturer PHOENIX CONTACT, this surge protective device guarantees exceptional quality and reliability. It is an ideal choice for applications in industrial settings, commercial buildings, and other environments where robust surge protection is essential to ensure uninterrupted operation and prevent costly equipment damage.', 0.00, 1, 6, 'pcs', 'Circuit Breaker', 'PHOENIX CONTACT', 'VAL-US-277/40/3+1-FM', '[\"\\/products\\/1778066473_69fb2429f2ea4_50086176.jpg\"]', '/datasheets/1778066473_datasheet_pgurl_2910374.pdf', 'in_stock', 1, '2026-05-06 11:21:13', '2026-05-06 11:21:34'),
(47, 14, 'Plug-in industrial relay with power contacts', NULL, 'REL-IR2/LDP- 24DC/2X21', 'Plug-in industrial relay with power contacts - 2 PDTs - test key - status LED - freewheeling diode - mechanical switch position indicator - polarity: A1+ - A2- - input voltage: 24 V DC', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', 'REL-IR2/LDP- 24DC/2X21', '[\"\\/products\\/1778066824_69fb258810cc1_48431695.jpg\"]', '/datasheets/1778066824_datasheet_pdf.dolineitemtypelineitemuid2903660.dolineitemtypelineitemuid290.pdf', 'in_stock', 1, '2026-05-06 11:27:04', '2026-05-06 11:27:39'),
(48, 14, 'Plug-in miniature relay - with power contact', NULL, 'REL-MR-230AC/21HC/MS', 'Plug-in miniature relay - with power contact - 1 PDT - test button - mechanical switch position indicator - status LED - input voltage 230 V AC', 0.00, 1, 6, 'pcs', 'Relay', 'PHOENIX CONTACT', 'REL-MR-230AC/21HC/MS', '[\"\\/products\\/1778067016_69fb26482c014_48820708.jpg\"]', '/datasheets/1778067016_datasheet_pdf.dolineitemtypelineitemuid2987914.dolineitemtypelineitemuid298.pdf', 'in_stock', 1, '2026-05-06 11:30:16', '2026-05-06 11:30:24'),
(49, 14, 'Plug-in miniature relay - with power contact', NULL, '2987956', 'Plug-in miniature relay - with power contact - 2 PDTs - test button - mechanical switch position indicator - status LED - input voltage 24 V AC', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', '2987956', '[\"\\/products\\/1778067344_69fb27903bc74_45208288.jpg\"]', '/datasheets/1778067344_datasheet_2987956-phoenix-contact-datasheet-177420517.pdf', 'in_stock', 1, '2026-05-06 11:35:44', '2026-05-06 11:35:51'),
(50, 14, 'miniature solid-state relay', NULL, '2967947', 'PLC-INTERFACE for output functions - consisting of PLC-BSC.../ACT basic terminal block with screw connection and plug-in miniature solid-state relay - for mounting on DIN rail NS 35/7,5 - 1 N/O contact - input: 24 V DC - output: 24 ... 253 V AC/0.75 A', 0.00, 1, 6, 'pcs', 'Relay', 'PHOENIX CONTACT', '2967947', '[\"\\/products\\/1778067675_69fb28db1b710_12156335.jpg\"]', '/datasheets/1778067675_datasheet_2967947.pdf', 'in_stock', 1, '2026-05-06 11:41:15', '2026-05-06 11:41:23'),
(51, 14, 'PLC-INTERFACE for railway applications - consisting of basic terminal block with push-in connection and integrated miniature solid-state relay', NULL, '2900391', 'PLC-INTERFACE for railway applications - consisting of basic terminal block with push-in connection and integrated miniature solid-state relay - range: 0.7 x UN to 1.25 x UN - temperature range: -25°C to +70°C - 1 N/O contact - input: 24 V DC - output: 12 - 140 V DC/3 A', 0.00, 1, 6, 'pcs', 'Relay', 'PHOENIX CONTACT', '2900391', '[\"\\/products\\/1778068037_69fb2a4550f54_44020477.jpg\"]', '/datasheets/1778068037_datasheet_2900391.pdf', 'in_stock', 1, '2026-05-06 11:47:17', '2026-05-06 11:47:25'),
(52, 14, 'Electromechanical Relay 24VDC 120VAC (80x6.2x94)mm Plug-In PLC Relay', NULL, 'PLC-OSC-120UC/24DC/2 C1D2', 'Electromechanical Relay 24VDC 120VAC (80x6.2x94)mm Plug-In PLC Relay', 0.00, 1, 5, 'pcs', 'Relay', 'PHOENIX CONTACT', 'PLC-OSC-120UC/24DC/2 C1D2', '[\"\\/products\\/1778068212_69fb2af466f0b_12160519.jpg\"]', '/datasheets/1778068212_datasheet_5603262.pdf', 'in_stock', 1, '2026-05-06 11:50:12', '2026-05-06 11:50:29'),
(53, 7, '0.75KW-1.5KW INVERTER', NULL, 'MN-6A7AA883227A5', 'Small size, saving installation space;\r\nCompatible with din rail, easy and quick to install;\r\nMultiple protection mechanisms, safe and secure;\r\n0-400Hz output frequency range;\r\n150% overload for 60s.', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786423427_6a7aa883203e1_inveter 1.png\"]', NULL, 'in_stock', 1, '2026-08-11 04:43:47', '2026-08-11 04:43:47'),
(54, NULL, '2.2KW INVERTER', NULL, 'MN-6A7AA9DFECBF6', 'Small size, saving installation space;\r\nCompatible with din rail, easy and quick to install;\r\nMultiple protection mechanisms, safe and secure;\r\n0-400Hz output frequency range;\r\n150% overload for 60s.', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786423825_6a7aaa11d55e6_inverter 2.png\"]', NULL, 'in_stock', 1, '2026-08-11 04:49:35', '2026-08-11 04:50:25'),
(55, 7, '4KW INVERTER', NULL, 'MN-6A7AAB85E513C', 'Small size, saving installation space;\r\nCompatible with din rail, easy and quick to install;\r\nMultiple protection mechanisms, safe and secure;\r\n0-400Hz output frequency range;\r\n150% overload for 60s.', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786424197_6a7aab85e4e46_inverter 3.png\"]', NULL, 'in_stock', 1, '2026-08-11 04:56:37', '2026-08-11 04:56:37'),
(56, 7, '5.5KW-7.5KW INVERTER', NULL, 'MN-6A7AACD78AB04', 'Small size, saving installation space;\r\nCompatible with din rail, easy and quick to install;\r\nMultiple protection mechanisms, safe and secure;\r\n0-400Hz output frequency range;\r\n150% overload for 60s.', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786424535_6a7aacd78a921_inverter 4.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:02:15', '2026-08-11 05:02:15'),
(57, 7, '0.75KW-2.2KW INVERTER', NULL, 'MN-6A7AAE2E08738', 'SVC Control Mode: Maximum output Frequency 320Hz\r\nVF Control Mode: Maximum output Frequency 1000Hz\r\nExcellent Braking Function, 0.75-22kW built-in brake unit \r\nSuperior Control Performance,Optimized PlD function\r\nShort-circuit protection in power-to-GND', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786424878_6a7aae2e08511_inv vb 1.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:07:58', '2026-08-11 05:07:58'),
(58, 7, '4KW INVERTER', NULL, 'MN-6A7AAED2B0585', 'Main Features:\r\n\r\nSVC Control Mode: Maximum output Frequency 320Hz\r\nVF Control Mode: Maximum output Frequency 1000Hz\r\nExcellent Braking Function, 0.75-22kW built-in brake unit \r\nSuperior Control Performance,Optimized PlD function\r\nShort-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425042_6a7aaed2b038f_inv vb 2.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:10:42', '2026-08-11 05:10:42'),
(59, 7, '5KW-7.5KW INVERTER', NULL, 'MN-6A7AAF2BDC9BB', '1.SVC Control Mode: Maximum output Frequency 320Hz\r\n\r\n2.VF Control Mode: Maximum output Frequency 1000Hz\r\n\r\n3.Excellent Braking Function, 0.75-22kW built-in brake unit \r\n\r\n4.Superior Control Performance,Optimized PlD function\r\n\r\n5.Short-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425131_6a7aaf2bdc7fd_inv vb 3.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:12:11', '2026-08-11 05:12:11'),
(60, 7, '11KW-15KW INVERTER', NULL, 'MN-6A7AAFC169A91', '1. SVC Control Mode: Maximum Output Frequency 320Hz\r\n\r\n2. VF Control Mode: Maximum Output Frequency 1000Hz\r\n\r\n3. Excellent Braking Function\r\n\r\n4. Superior Control Performance,Optimized PID function\r\n\r\n5. Random Carrier Function\r\n\r\n6. Short-circuit protection in power-to-GND\r\n\r\n7. Support speed mode and torque mode,low speed with high torque output\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425281_6a7aafc1698ef_inv vb 4.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:14:41', '2026-08-11 05:14:41'),
(61, 7, '18.5KW-22KW INVERTER', NULL, 'MN-6A7AB00F66A54', '1.SVC Control Mode: Maximum output Frequency 320Hz\r\n\r\n2.VF Control Mode: Maximum output Frequency 1000Hz\r\n\r\n3.Excellent Braking Function, 0.75-22kW built-in brake unit \r\n\r\n4.Superior Control Performance,Optimized PlD function\r\n\r\n5.Short-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phas', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425359_6a7ab00f66898_inv vb 5.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:15:59', '2026-08-11 05:15:59'),
(62, 7, '30KW-37KW INVERTER', NULL, 'MN-6A7AB062EA560', '1. SVC Control Mode: Maximum Output Frequency 320Hz\r\n\r\n2. VF Control Mode: Maximum Output Frequency 1000Hz\r\n\r\n3. Excellent Braking Function\r\n\r\n4. Superior Control Performance,Optimized PID function\r\n\r\n5. Random Carrier Function\r\n\r\n6. Short-circuit protection in power-to-GND\r\n\r\n7. Support speed mode and torque mode,low speed with high torque output\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425442_6a7ab062ea3a3_inv vb 6.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:17:22', '2026-08-11 05:17:22'),
(63, 7, '45KW-55KW INVERTER', NULL, 'MN-6A7AB0F2E124C', '1.SVC Control Mode: Maximum output Frequency 320Hz\r\n\r\n2.VF Control Mode: Maximum output Frequency 1000Hz\r\n\r\n3.Excellent Braking Function, 0.75-22kW built-in brake unit \r\n\r\n4.Superior Control Performance,Optimized PlD function\r\n\r\n5.Short-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425586_6a7ab0f2df357_inv vb 7.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:19:46', '2026-08-11 05:19:46'),
(64, 7, '75KW-110KW INVERTER', NULL, 'MN-6A7AB1B971F53', '1. SVC Control Mode: Maximum Output Frequency 320Hz\r\n\r\n2. VF Control Mode: Maximum Output Frequency 1000Hz\r\n\r\n3. Excellent Braking Function\r\n\r\n4. Superior Control Performance,Optimized PID function\r\n\r\n5. Random Carrier Function\r\n\r\n6. Short-circuit protection in power-to-GND\r\n\r\n7. Support speed mode and torque mode,low speed with high torque output\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786425785_6a7ab1b971d9c_inv vb 8.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:23:05', '2026-08-11 05:23:05'),
(65, 7, '132KW-185KW INVERTER', NULL, 'MN-6A7AB3E94A1E5', '1.SVC Control Mode: Maximum output Frequency 320Hz\r\n\r\n2.VF Control Mode: Maximum output Frequency 1000Hz\r\n\r\n3.Excellent Braking Function, 0.75-22kW built-in brake unit \r\n\r\n4.Superior Control Performance,Optimized PlD function\r\n\r\n5.Short-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786426345_6a7ab3e94a024_inv vb 9.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:32:25', '2026-08-11 05:32:25'),
(66, 7, '200KW-280KW INVERTER', NULL, 'MN-6A7AB492B94D7', '1.SVC Control Mode: Maximum output Frequency 320Hz\r\n\r\n2.VF Control Mode: Maximum output Frequency 1000Hz\r\n\r\n3.Excellent Braking Function, 0.75-22kW built-in brake unit \r\n\r\n4.Superior Control Performance,Optimized PlD function\r\n\r\n5.Short-circuit protection in power-to-GND\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786426514_6a7ab492b92ce_inv vb 13.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:35:14', '2026-08-11 05:35:14'),
(67, 7, '315KW-400KW INVERTER', NULL, 'MN-6A7AB559E65B1', '1. SVC Control Mode: Maximum Output Frequency 320Hz\r\n\r\n2. VF Control Mode: Maximum Output Frequency 1000Hz\r\n\r\n3. Excellent Braking Function\r\n\r\n4. Superior Control Performance,Optimized PID function\r\n\r\n5. Random Carrier Function\r\n\r\n6. Short-circuit protection in power-to-GND\r\n\r\n7. Support speed mode and torque mode,low speed with high torque output\r\n\r\nAvailable for 220V/Single phase, 380V/415V/440V Three phase, 220V/Three phase', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786426713_6a7ab559e63df_inv vb 14.png\"]', NULL, 'in_stock', 1, '2026-08-11 05:38:33', '2026-08-11 05:38:33'),
(68, 7, '0.75kW-4kW VC INVERTER', NULL, 'MN-6A7AB60CB8EEC', '1. Support EtherCAT, Profinet protocol;\r\n\r\n2. Wide voltage input;\r\n\r\n3. Compatible with synchronous /asynchronous motor;\r\n\r\n4. Narrow-body and compact structure;\r\n\r\n5. Rich application, macro parameters.\r\n\r\nAvailable for 220V-240V / Single phase, 380V-480V / Three phase', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786426892_6a7ab60cb8d07_inv vc 1.jpg\"]', NULL, 'in_stock', 1, '2026-08-11 05:41:32', '2026-08-11 05:41:32'),
(69, 7, '5.5kW-37kW VC INVERTER', NULL, 'MN-6A7AB6679ECEE', '1. Support EtherCAT, Profinet protocol;\r\n\r\n2. Wide voltage input;\r\n\r\n3. Compatible with synchronous /asynchronous motor;\r\n\r\n4. Narrow-body and compact structure;\r\n\r\n5. Rich application, macro parameters.', 0.00, 1, 3, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786426983_6a7ab6679eb51_inv vc 2.jpg\"]', NULL, 'in_stock', 1, '2026-08-11 05:43:03', '2026-08-11 05:43:03'),
(70, 7, '45kW-160kW VC INVERTER', NULL, 'MN-6A7AB6EBA5E80', '1. Support EtherCAT, Profinet protocol\r\n\r\n2. Keyboard\r\n\r\nStandardly equipped with a dual-line display keyboard. Optional LCD keyboard is also available and firmware version \r\n\r\ndownload is supported.\r\n3. Breaking unit\r\n\r\n45-110kW the braking unit is optional.\r\n4. Expansion\r\n\r\nStandardly equipped with dual expansion interfaces, supporting multiple combinations \r\n\r\nsuch as dual PG/communication/I/O + STO.\r\n5. IO terminal\r\nIO terminal addition: 6DI,2AI, 2AO, 1DO, 2 Relay.', 0.00, 1, 2, 'nos', 'VFD', NULL, NULL, '[\"\\/products\\/1786427115_6a7ab6eba5c87_inv vc 3.jpg\"]', NULL, 'in_stock', 1, '2026-08-11 05:45:15', '2026-08-11 05:45:15');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `completion_date` date DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'In Progress',
  `logo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_image_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `client`, `location`, `description`, `technologies`, `completion_date`, `status`, `logo_path`, `thumbnail_path`, `client_logo`, `project_image_urls`, `created_at`, `updated_at`) VALUES
(15, 'Online Weighing Conveyor', 'Plenty Foods (pvt) Ltd', 'Janasavigama ,Kandy', 'Titec Automation Solutions  implemented program an online weighing conveyor system for dry corn handling. The system enables continuous measurement of material weight during the conveying process using a Flintec load-cell-based weighing system. An XINJE XD Series PLC controls the conveyor and weighing process, while the XINJE TouchWin HMI provides real-time monitoring and operator control. The system improves weighing accuracy, process monitoring, and operational efficiency.', '[\"XINJE XD Series PLC\",\"XINJE TouchWin HMI\",\"Flintech Load Cell Weighing System\",\"Conveyor Automation\",\"Industrial Sensors\"]', '2021-02-17', 'Completed', '/projects/logos/1786420430_6a7a9ccec2c6c_logo_images.jfif', '/projects/1786421207_6a7a9fd78d1c0_thumb_5.png', NULL, '[\"\\/projects\\/gallery\\/1786421127_6a7a9f87c5c9a_gallery_4.png\"]', '2026-08-11 03:53:50', '2026-08-11 04:06:47'),
(16, 'Fermentation Room Control System', 'Ceylon Biscuits Limited', 'Pannipitiya', 'Titec Automation Solutions designed and implemented an automated fermentation room control system for precise environmental monitoring and control. The system uses Siemens temperature and humidity sensors to continuously monitor the fermentation room conditions. An XINJE XD Series PLC processes the sensor data and manages the control functions, while the XINJE TouchWin HMI provides real-time visualization, operator control, status monitoring and alarm indication. The system helps maintain stable environmental conditions to support a consistent and controlled fermentation process.', '[\"XINJE XD Series PLC\",\"XINJE TouchWin HMI\",\"Siemens Temperature Sensors\",\"Siemens Humidity Sensors\",\"Temperature & Humidity Control\",\"Industrial Automation\"]', '2021-03-11', 'Completed', '/projects/logos/1786422517_6a7aa4f528127_logo_5.jfif', '/projects/1786422517_6a7aa4f527dbf_thumb_1.png', NULL, '[\"\\/projects\\/gallery\\/1786422517_6a7aa4f52820b_gallery_1.png\",\"\\/projects\\/gallery\\/1786422517_6a7aa4f528454_gallery_3.png\",\"\\/projects\\/gallery\\/1786422517_6a7aa4f5286f7_gallery_52ZK90-A3020-1_v2.jfif\"]', '2026-08-11 04:28:37', '2026-08-11 04:28:37'),
(17, '4-Master Carton Robotic Packing System', 'CBL Foods International (Pvt) Limited', 'Ranala , Habarakada', 'Titec Automation Solutions designed and implemented a multi-line robotic master carton packing system consisting of four automated packing lines and eight Kawasaki RS007L industrial robot arms. The system automates the handling and packing of products into master cartons, improving packing speed, consistency and operational efficiency. Mitsubishi FX5 Series PLCs are used for machine control and sequence management, while Kinco HMI panels provide operator control, system monitoring, status indication and alarm management. The robotic cells are integrated with the production process to provide reliable and synchronized automated carton packing.', '[\"Kawasaki RS007L Robots\",\"Mitsubishi FX5 Series PLC\",\"Kinco HMI\",\"Robotic Carton Packing\",\"Industrial Automation\",\"Robot Integration\"]', '2025-08-11', 'Completed', '/projects/logos/1786423254_6a7aa7d6311d2_logo_images (1).png', '/projects/1786423254_6a7aa7d631043_thumb_images.png', NULL, '[\"\\/projects\\/gallery\\/1786423254_6a7aa7d631287_gallery_1.jfif\",\"\\/projects\\/gallery\\/1786423254_6a7aa7d631335_gallery_images.png\"]', '2026-08-11 04:40:54', '2026-08-11 04:40:54'),
(18, '2-Master Carton Robotic Packing Lines', 'CBL Export (Pvt) Ltd', 'Awissawella', 'Titec Automation Solutions implemented a multi-line robotic master carton packing system for Ceylon Biscuits Limited – Export (Pvt) Ltd. The system consists of multiple automated packing lines, with three Kawasaki RS007L robot arms installed on each line for high-speed product handling and master carton packing. Siemens S7-1500 PLCs provide centralized machine control and sequence management, while Siemens 7-inch HMI panels enable operators to monitor and control each packing line. The integrated robotic solution improves packing speed, consistency, reliability and overall production efficiency.', '[\"Kawasaki RS007L Robots\",\"Siemens S7-1500 PLC\",\"Siemens 7-inch HMI\",\"Robotic Carton Packing\",\"Conveyor Automation\",\"Industrial Robot Integration\"]', '2025-10-12', 'Completed', '/projects/logos/1786423976_6a7aaaa83926b_logo_images (1).png', '/projects/1786423976_6a7aaaa83910b_thumb_images.png', NULL, '[\"\\/projects\\/gallery\\/1786423976_6a7aaaa839329_gallery_1.jfif\",\"\\/projects\\/gallery\\/1786423976_6a7aaaa8393cb_gallery_images.png\"]', '2026-08-11 04:52:56', '2026-08-11 04:53:07'),
(19, 'Delta Robot Tray Packing System – R&D Base Project', 'CBL Foods International (Pvt) Limited', 'Ranala ,  Habarakada', 'Titec Automation Solutions developed an R&D-based delta robotic tray packing system for the automated packing of chocolate-coated biscuits into trays. The system integrates an Omron vision system for accurate product detection, inspection and positioning, together with Atomrobot delta robots for high-speed and precise pick-and-place operations. The vision-guided robots identify and accurately pick individual biscuits before placing them into trays in the required arrangement. The system was designed with a strong focus on food safety and hygienic operation, incorporating food-grade product-contact components, hygienic design principles, easy-to-clean surfaces, controlled product handling and minimized direct human contact with the biscuits. The project was developed as a base platform for evaluating and advancing high-speed robotic automation solutions for food packaging applications, with a focus on food safety, precision, repeatability, reliability and production efficiency.', '[\"Atomrobot Delta Robots\",\"Omron Vision System\",\"Machine Vision\",\"Robotic Pick & Place\",\"Tray Packing\",\"Conveyor Automation\",\"Food-Grade Vacuum and Soft Gripper\"]', '2026-03-29', 'In Progress', '/projects/logos/1786425505_6a7ab0a145920_logo_images (1).png', '/projects/1786425505_6a7ab0a144deb_thumb_2.png', NULL, '[\"\\/projects\\/gallery\\/1786425505_6a7ab0a145a0c_gallery_2.png\"]', '2026-08-11 05:18:25', '2026-08-11 05:23:59'),
(20, 'UR Robot Arm to Kawasaki Robot Arm Conversion Project', 'Ceylon Biscuits Limited', 'Pannipitiya', 'Titec Automation Solutions successfully completed a major robot conversion project for Ceylon Biscuits Limited, replacing eight existing UR robot arms with eight Kawasaki industrial robot arms across four automated packing lines. The project involved the complete integration of the Kawasaki robots into the existing packing systems, including mechanical and electrical integration, end-of-arm tooling adaptation, robot programming, motion sequence development and communication with the existing machine control systems. Each packing line was upgraded with two Kawasaki robot arms to maintain synchronized and reliable product handling and packing operations. The conversion was carried out with minimal disruption to production, while improving robotic performance, repeatability, maintainability and long-term operational reliability.', '[\"8 \\u00d7 Kawasaki Industrial Robots\",\"8 \\u00d7 UR Robot Replacements\",\"Robot Programming\",\"Robot Integration\",\"Packing Line Automation\",\"PLC Integration\",\"Conveyor Automation\",\"Robot Commissioning\"]', '2026-07-25', 'Completed', '/projects/logos/1786426756_6a7ab58476a9c_logo_5.jfif', '/projects/1786426756_6a7ab584761e0_thumb_1.png', NULL, '[]', '2026-08-11 05:39:16', '2026-08-11 05:39:16');

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` bigint UNSIGNED NOT NULL,
  `quotation_request_id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED NOT NULL,
  `grand_total` decimal(10,2) DEFAULT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_requests`
--

CREATE TABLE `quotation_requests` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_request_items`
--

CREATE TABLE `quotation_request_items` (
  `id` bigint UNSIGNED NOT NULL,
  `quotation_request_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`id`, `title`, `description`, `image_path`, `slug`, `sort_order`, `created_at`, `updated_at`) VALUES
(2, 'Industrial Automation Solutions', 'Everything related to automation systems, controllers, and smart integration.', '/services/1771266123_6993604ba6f27_JAT.png', 'industrial-automation-solutions', 1, '2026-02-16 17:25:07', '2026-02-16 18:22:03'),
(3, 'Electrical Power & Control Panels', 'All electrical panel design, fabrication, and power distribution systems.', '/services/electrical_panels.png', 'electrical-power-and-control-panels', 2, '2026-02-16 17:25:14', '2026-02-16 17:25:14'),
(4, 'Renewable Energy Solutions', 'Everything related to sustainable power systems.', '/services/renewable_energy.png', 'renewable-energy-solutions', 3, '2026-02-16 17:25:18', '2026-02-16 17:25:18'),
(5, 'Home Automation & Security', 'Smart home and residential solutions.', '/services/home_automation.png', 'home-automation-and-security', 4, '2026-02-16 17:25:20', '2026-02-16 17:25:20'),
(6, 'Emergency Support', 'Our Warranty for you. 24/7 Emergency Service.', '/services/emergency_support.png', 'emergency-support', 5, '2026-02-16 17:25:21', '2026-02-16 17:25:21');

-- --------------------------------------------------------

--
-- Table structure for table `service_items`
--

CREATE TABLE `service_items` (
  `id` bigint UNSIGNED NOT NULL,
  `service_category_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `service_items`
--

INSERT INTO `service_items` (`id`, `service_category_id`, `title`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES
(34, 2, 'Data Monitoring, Recording & Analytics Systems', 'Smart data logging and analysis solutions for better decision-making and efficiency tracking.', 9, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(32, 2, 'Motor Control Panels', 'Robust, safety-compliant control panels designed to deliver consistent motor performance.', 7, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(33, 2, 'Troubleshooting, Upgrades & Modifications', 'Fast fault diagnosis, repairs, and performance improvements for existing systems.', 8, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(31, 2, 'Robot Arm Configuration and Programming', 'Professional setup, calibration, and programming of robotic arms for automated workflows.', 6, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(30, 2, 'VFD, Servo, Stepper & DC Drive Programming', 'Optimize motor performance with expert drive tuning and programming for any application.', 5, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(29, 2, 'HMI & SCADA Designing and Programming', 'Interactive, real-time monitoring and control interfaces for seamless plant operation.', 4, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(28, 2, 'PLC Programming', 'Custom PLC solutions that keep your machines running smoothly, safely, and with precise control.', 3, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(27, 2, 'Machine Installations', 'Complete installation and commissioning of industrial machines with precise alignment, safety compliance, and reliable performance from day one.', 2, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(26, 2, 'Machines fabrication', 'Custom-made machine fabrication tailored to your operational needs—built for durability, efficiency, and seamless integration into your production line.', 1, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(25, 2, 'Complete Automation Systems', 'Upgrade your facility with fully integrated automation systems designed for reliability, efficiency, and long-term performance.', 0, '2026-02-16 18:22:03', '2026-02-16 18:22:03'),
(12, 3, 'Electrical Power Panel Designing & Fabrication', 'Custom-built panels engineered to meet your power requirements and industry standards.', 0, '2026-02-16 17:25:15', '2026-02-16 17:25:15'),
(13, 3, 'Electrical Distribution Panels', 'Safe and organized distribution of power across your facility with high-quality components.', 1, '2026-02-16 17:25:15', '2026-02-16 17:25:15'),
(14, 3, 'ATS (Automatic Transfer Switch) Panels', 'Automatic and manual transfer switch panels for uninterrupted power during outages.', 2, '2026-02-16 17:25:16', '2026-02-16 17:25:16'),
(15, 3, 'MTS (Manual Transfer Switch) Panels', 'Reliable manual switching solutions for power management.', 3, '2026-02-16 17:25:16', '2026-02-16 17:25:16'),
(16, 3, 'Fire Pump Panels (Duty + Standby)', 'Dedicated panels ensuring reliable fire pump operation in emergency conditions.', 4, '2026-02-16 17:25:16', '2026-02-16 17:25:16'),
(17, 3, 'Capacitor Bank Panels', 'Improve power factor and reduce energy costs with precisely engineered capacitor bank systems.', 5, '2026-02-16 17:25:17', '2026-02-16 17:25:17'),
(18, 3, 'Building wiring', 'Safe, reliable, and standards-compliant electrical wiring for residential, commercial, and industrial buildings.', 6, '2026-02-16 17:25:17', '2026-02-16 17:25:17'),
(19, 3, 'Cable management systems', 'Organized and efficient cable routing solutions that improve safety, reduce clutter, and ensure long-term maintainability of your electrical systems.', 7, '2026-02-16 17:25:18', '2026-02-16 17:25:18'),
(20, 4, 'Off-Grid Solar Systems', 'Independent solar setups that deliver reliable power in remote locations—day and night.', 0, '2026-02-16 17:25:19', '2026-02-16 17:25:19'),
(21, 4, 'Solar Water Pump Systems', 'Energy-efficient solar pumping solutions for agriculture, irrigation, and rural applications.', 1, '2026-02-16 17:25:19', '2026-02-16 17:25:19'),
(22, 5, 'Smart Home Automation', 'Control lighting, appliances, climate, and more—with complete automation and mobile access.', 0, '2026-02-16 17:25:20', '2026-02-16 17:25:20'),
(23, 5, 'Security System Installations (CCTV, Alarms, Access Control)', 'Professional CCTV, alarm, and access control systems to protect what matters most.', 1, '2026-02-16 17:25:21', '2026-02-16 17:25:21'),
(24, 6, '24/7 Emergency Service', 'Round-the-clock support for critical breakdowns and urgent repairs—anytime, anywhere.', 0, '2026-02-16 17:25:22', '2026-02-16 17:25:22'),
(35, 2, 'Vision System Integration', 'Machine vision setups for accurate detection, quality inspection, and automation of visual tasks.', 10, '2026-02-16 18:22:03', '2026-02-16 18:22:03');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4rsQUkGL2szyqWaoqvnCBx1enY05c1RPinV1zpJc', NULL, '64.23.132.143', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic0dUZzlJZWFKNGdaV0JkUklFUXdNZVlUQVVVMW5wV1JKTDlUQWlocSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5sayI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1788076481),
('B6z7hMrA4WM4pI33kSe9axIXDkLw5D8AMeKKXdmb', NULL, '150.251.225.167', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOGlxTTg3dTBmYkg1Y2pjY09jdU0xajRGcmVIY2U3OUlZcElQR3hiOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5sayI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787942131),
('baZFCSjwLuc6scFf2DxbeF03MB2YlfH6hOl1sGeJ', NULL, '47.89.195.183', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXlJTmdmalF5OG1ScGU3d0VheTA3RWZoMXVXRGVBNFgxOFAzT3FUaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5sayI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787821158),
('c8OtfwXq34xNqyE3Wlgn0nWAaIXMECemfXPb5oD6', NULL, '34.225.164.177', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlJ1ZlNsMEVUV2RHTGJTbU5aSzcwWjNMUHM1WUc4QUhIN3NSWjZweSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787602639),
('CzxH5iXbh1GKrXwZSEd3jYm1t0VdNQWv08gmNq6f', NULL, '34.85.128.88', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoienhsbjhOMG9uQlRGWDFWV0JyUjZGTW9icU9qczVxOEJVWFNtd3R2cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787581843),
('GLSVTUsunfqxgSUBfrBSabEEEc7LqgqvUUpe5fQS', NULL, '178.128.244.241', 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTFAyZkVqQU5pdU9HM1ZNZnNEZmVIZkNTMFZGalhmQzdlWmoyQ2VUMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787928591),
('LfH51uJ4DTSs8EJqQWHkAqxTFMAoQIeCGE5E0Kag', NULL, '188.166.27.94', 'Mozilla/5.0 (compatible; ForestEngine/1.0; +https://forestengine.net/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYU9VNEhjdDI5NUkyY2ptZjJPTFdoNWhVQ2lzNlV2TUc1b2h4NEhzbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788161875),
('mcX7JVHN5s9suV3rmGun7WfpZ0tomv9NvB0LLROp', NULL, '3.89.252.179', 'Mozilla/5.0 (compatible; getdomaindata/1.0; +https://getdomaindata.com/bot)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkJHaW1SbVRFQWtoWlZOa21maFZwUTcweUpFN2ExUldMYW9QYkxiaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787583782),
('MmjK4I3cCOVBuxofUbaZDByycNfFhmedTA4HOUpT', NULL, '35.227.15.49', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2dyaGt0V1dScDNlc0tSRzNuTGxRemtKdURzQTM5VDNoUk5NWkhVNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1787853214),
('NRe1XRyzR4XosmWtgnedgnFZxsDgJ20ktqYlDiS6', NULL, '64.225.72.208', 'Mozilla/5.0 (compatible; ForestEngine/1.0; +https://forestengine.net/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWdINFlncXRrRVM4d1BJdXZzVVpoblp0WjZFMUxJb3hwbG1kM1B6aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788172548),
('nw3JB8XKK0bKrB10ZJnVbUX5EEfkMZO3oacttc1t', NULL, '192.248.32.221', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNlJiYUQ5bUdhSTRqdjZ0UXNrUksyd2xxOHBJT3NRZ2lGcFBZbFUxNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5say9hcGkvYnJhbmRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1788327891),
('POv8Gz7fs39XwwUWrVoCYiyDBtsFWux6MmIcyloC', NULL, '47.89.195.183', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHgzZmJ0RU9xZGl3UUNUTkhBYXF0SGtwV1BMTTRpajExemJtVFdqUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5sayI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1787821161),
('pyCeVBrgntUiRbAO5CKXXj74PU5QAr9QEDlUlHa1', NULL, '45.121.89.214', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGF3aVdGQ1hUYTFlVjk3OVJxclRpbDVRQjlGYnpKeFNNMFp0Y1F2QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5say9hcGkvYnJhbmRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787818526),
('rZ8xulAmg966SZ6ULvsPAWsgBwDgMOvSDXzHJL0u', NULL, '3.85.196.206', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWRoRGc2Y3lGMTIxSDJ1TXd3UXhldXVTWUJCMklmM2dYdENCOHZRbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788116297),
('suaqZarMZD6gQqXOhrwDyPytZAV1ntZLldYsTUxn', NULL, '104.248.192.143', 'Mozilla/5.0 (compatible; ForestEngine/1.0; +https://forestengine.net/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic083dVU3amxNU2piTkZ4NGdOejBLMjRrTWhCbWhBcHJaeG9oMUgybCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5sayI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1788189924),
('tDlFKNXzVCKb7cs3WCAx8OliyP6tcx3sP4e3x1dO', NULL, '34.82.210.30', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUU1TT3ZDNTZLWG9lVHFXUDJRRmZjYU4zeFlBcFJ1VEJDaUNCbDFrNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788185383),
('uYwnoHr23AMkZnMZbuH6a5hcmENlPImZVFkhl1GJ', NULL, '45.121.89.214', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGEwNkJCRkNuQ1VQT1ZMOGwwaUVzWFliVDJrSnFIcGNEU3J1czVhOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5say9hcGkvYnJhbmRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1787818526),
('Xuw0EhxQPdpZgBa7cVWo0oZ5Acq7GW5pNzuZUU5H', NULL, '192.248.32.221', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDRIYkRTMElFQlFuYUxkRnNGakxwTnZGbXpKb2xDTVh1QklpaHhkViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHBzOi8vYXBpLnRpdGVjYXV0b21hdGlvbi5say9hcGkvYnJhbmRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1788327890),
('XVWTK2fEabQtzKa13UDrsG70qy8rnvOVaevuHjBa', NULL, '34.61.10.100', 'Mozilla/5.0 (compatible; CMS-Checker/1.0; +https://example.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDdDS3gzY0JWNzVyMzZYSFYzbnF4S2xzajY1SEJ5VTFiZ2IzWEltNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788184893),
('yzoywkg4l5YQ8vTSqzG4oNGuEkOdRmTv2Ro5L294', NULL, '157.230.186.239', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFM1V0g2Y3dienJlaDhlOXpnZUhGQlE4dldPV3lsclVzTU14UVZQeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS50aXRlY2F1dG9tYXRpb24ubGsiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1788102305);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(4, 'Lahiru', 'lahiru@titecautomation.lk', '2026-02-06 08:37:43', '$2y$12$dnypIPFyXR5PtB0aautBK.c4oEpKbFrmm55tG0aCoF8EAzjX7wbya', 'admin', NULL, '2026-02-06 08:37:47', '2026-02-06 08:37:47'),
(5, 'Jithma', 'jithma@titecautomation.lk', '2026-02-06 08:37:48', '$2y$12$tQx6N/6x94QCyjwb0kUWS.rJLRmjJ8Ancm9TnqhBBhJpZtq8v/e.m', 'admin', NULL, '2026-02-06 08:37:49', '2026-02-06 08:37:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_slug_unique` (`slug`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_model_number_unique` (`model_number`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotations_quotation_request_id_foreign` (`quotation_request_id`),
  ADD KEY `quotations_admin_id_foreign` (`admin_id`);

--
-- Indexes for table `quotation_requests`
--
ALTER TABLE `quotation_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotation_request_items`
--
ALTER TABLE `quotation_request_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_request_items_quotation_request_id_foreign` (`quotation_request_id`),
  ADD KEY `quotation_request_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_items`
--
ALTER TABLE `service_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_category_id` (`service_category_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotation_requests`
--
ALTER TABLE `quotation_requests`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `quotation_request_items`
--
ALTER TABLE `quotation_request_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `service_items`
--
ALTER TABLE `service_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `quotations_quotation_request_id_foreign` FOREIGN KEY (`quotation_request_id`) REFERENCES `quotation_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quotation_request_items`
--
ALTER TABLE `quotation_request_items`
  ADD CONSTRAINT `quotation_request_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `quotation_request_items_quotation_request_id_foreign` FOREIGN KEY (`quotation_request_id`) REFERENCES `quotation_requests` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
