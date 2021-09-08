create database t1;

use t1;

create table preuserid(
    id int not null auto_increment,
    is_allocationed boolean not null default false,
    is_deleted boolean not null default false,
    primary key(id)
);

create table user(
    id int not null auto_increment,
    preuserid int not null,
    name varchar(20) not null default '',
    age int not null default 0,
    password int not null default 0,
    meesage_id int not null default 1000000000,
    -- FOREIGN KEY (preuserid) REFERENCES preuserid(id) ON DELETE CASCADE,
    -- INDEX (preuserid, password),
    -- unique (preuserid),
    primary key(id)
);

create table number_shared(
    id int not null auto_increment,
    number_shared int not null,
    max_id int not null
)

create table chat_record (
    id int not null auto_increment,
    send_id int not null,
    receive_id int not null,
    time_stamp timestamp not null default current_timestamp,
    message_id int not null default 0,
    content varchar(255) not null default '',
    primary key(id)
);
-- 2018-01-01 00:00:01

ALTER TABLE user ADD CONSTRAINT  FOREIGN KEY(preuserid) REFERENCES preuserid(id) ;

-- 我们先插入所有的数据再创建索引，避免索引导致数据插入失败 （user 表10w数据大概执行了 4min ，外键索引）


LOAD DATA LOCAL INFILE "dump3" into table user FIELDS TERMINATED BY ",";

delimiter //
create procedure per100000() 
begin 
declare num int; 
set num=1; 
while num < 100000 do 
insert preuserid() values();
set num=num+1;
end while;
end
//

call per2();
