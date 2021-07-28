/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : blogs

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 07/01/2021 06:31:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------_
-- Table structure for t_blog
-- ----------------------------
DROP TABLE IF EXISTS `t_blog`;
CREATE TABLE `t_blog`  (
  `id` int(0) NOT NULL COMMENT 'primary key',
  `user_id` int(0) NOT NULL COMMENT 'user id',
  `blog_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'blog type：1：orignal；2：reprinted；3：translation；4：others',
  `blog_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'blog title',
  `blog_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'blog picture',
  `blog_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'blog content',
  `create_time` datetime DEFAULT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  `is_del` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'whether or not to delete：0：normal；1：delete',
  `is_top` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'whether or not to placed at the top：0：normal；1：placed at th top',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_level
-- ----------------------------
DROP TABLE IF EXISTS `t_level`;
CREATE TABLE `t_level`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `level` int(0) DEFAULT NULL COMMENT 'level',
  `level_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'level explaination',
  `is_banned` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT 'whether to disable：0：normal；1：disable',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_level
-- ----------------------------
INSERT INTO `t_level` VALUES (1, 1, 'Gold blogger', '0');
INSERT INTO `t_level` VALUES (2, 2, 'Platinum blogger', '0');
INSERT INTO `t_level` VALUES (3, 3, 'Diamond blogger', '0');
INSERT INTO `t_level` VALUES (4, 4, 'King blogger', '0');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Phone：login account',
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'passwaord',
  `nickname` int(0) DEFAULT NULL COMMENT 'user nickname',
  `head_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'user profile address',
  `personal_sign` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'personal signature',
  `level_id` int(0) DEFAULT 1 COMMENT 'user level',
  `create_time` DATETIME DEFAULT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  `is_del` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT 'whether to delete：0：normal；1：delete',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'user information table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_user_info
-- ----------------------------
DROP TABLE IF EXISTS `t_user_info`;
CREATE TABLE `t_user_info`  (
  `id` int(0) NOT NULL COMMENT 'Primary key',
  `user_id` int(0) DEFAULT NULL COMMENT 'user id',
  `original_count` int(0) DEFAULT 0 COMMENT 'Original statistical',
  `week_count` int(0) DEFAULT 0 COMMENT 'week rank',
  `total_count` int(0) DEFAULT 0 COMMENT 'Total rank',
  `access_count` int(0) DEFAULT 0 COMMENT 'Page view',
  `history_count` int(0) DEFAULT 0 COMMENT 'history',
  `integral_count` int(0) DEFAULT 0 COMMENT 'integration',
  `fans_count` int(0) DEFAULT 0 COMMENT 'fans',
  `praised_count` int(0) DEFAULT 0 COMMENT 'like',
  `comment_count` int(0) DEFAULT 0 COMMENT 'comment',
  `favorite_count` int(0) DEFAULT 0 COMMENT 'collection',
  `attention_count` int(0) DEFAULT 0 COMMENT 'attention',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
