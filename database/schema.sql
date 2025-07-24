create database shelfsmart_db
    with owner postgres;

create table public."user"
(
    id              serial
        primary key,
    name            varchar   not null,
    email           varchar   not null,
    hashed_password varchar   not null,
    created_at      timestamp not null,
    store_nbr       integer   not null
);

alter table public."user"
    owner to postgres;

create unique index ix_user_email
    on public."user" (email);

create index ix_user_store_nbr
    on public."user" (store_nbr);

create table public.product
(
    id             serial
        primary key,
    item_nbr       integer not null,
    item_name      varchar not null,
    item_category  varchar,
    item_inventory integer,
    store_nbr      integer not null,
    date           date    not null,
    constraint unique_store_item
        unique (store_nbr, item_nbr)
);

alter table public.product
    owner to postgres;

create index ix_product_store_nbr
    on public.product (store_nbr);

create table public.sales
(
    id          serial
        primary key,
    date        date    not null,
    store_nbr   integer not null,
    item_nbr    integer not null,
    unit_sales  double precision,
    onpromotion boolean,
    category    varchar,
    holiday     integer,
    item_class  integer,
    perishable  integer,
    price       double precision,
    cost_price  double precision,
    constraint unique_date_store_item
        unique (date, store_nbr, item_nbr)
);

alter table public.sales
    owner to postgres;

create index ix_sales_store_nbr
    on public.sales (store_nbr);

create table public.upload
(
    id         serial
        primary key,
    user_id    integer   not null
        references public."user",
    filename   varchar   not null,
    status     varchar   not null,
    row_count  integer,
    created_at timestamp not null,
    store_nbr  integer   not null
);

alter table public.upload
    owner to postgres;

create index ix_upload_user_id
    on public.upload (user_id);

create index ix_upload_store_nbr
    on public.upload (store_nbr);

create table public.posconnection
(
    id           serial
        primary key,
    user_id      integer   not null
        references public."user",
    pos_url      varchar   not null,
    api_key      varchar   not null,
    connected_at timestamp not null,
    store_nbr    integer   not null
);

alter table public.posconnection
    owner to postgres;

create index ix_posconnection_store_nbr
    on public.posconnection (store_nbr);

create index ix_posconnection_user_id
    on public.posconnection (user_id);

create table public.forecast
(
    id              serial
        primary key,
    user_id         integer          not null
        references public."user",
    store_nbr       integer          not null,
    item_nbr        integer          not null,
    prediction_date date             not null,
    predicted_sales double precision not null,
    category        varchar,
    item_class      integer,
    perishable      boolean,
    model_version   varchar,
    uploaded_at     timestamp        not null,
    source_file     varchar,
    item_name       varchar(255),
    constraint forecast_user_store_item_date_unique
        unique (user_id, store_nbr, item_nbr, prediction_date)
);

alter table public.forecast
    owner to postgres;

create index ix_forecast_store_nbr
    on public.forecast (store_nbr);

create index ix_forecast_user_id
    on public.forecast (user_id);

