export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bigint: { input: any; output: any; }
  json: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** 用户地址表 */
export type Addresses = {
  __typename?: 'addresses';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 是否默认 */
  is_default: Scalars['Boolean']['output'];
  /** 收货地址，完整省市区和详细地址 */
  receiver_address: Scalars['String']['output'];
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name: Scalars['String']['output'];
  /** 收货电话 */
  receiver_phone: Scalars['String']['output'];
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  user_users: Scalars['bigint']['output'];
};

/** aggregated selection of "addresses" */
export type Addresses_Aggregate = {
  __typename?: 'addresses_aggregate';
  aggregate?: Maybe<Addresses_Aggregate_Fields>;
  nodes: Array<Addresses>;
};

export type Addresses_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Addresses_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Addresses_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Addresses_Aggregate_Bool_Exp_Count>;
};

export type Addresses_Aggregate_Bool_Exp_Bool_And = {
  arguments: Addresses_Select_Column_Addresses_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Addresses_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Addresses_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Addresses_Select_Column_Addresses_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Addresses_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Addresses_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Addresses_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Addresses_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "addresses" */
export type Addresses_Aggregate_Fields = {
  __typename?: 'addresses_aggregate_fields';
  avg?: Maybe<Addresses_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Addresses_Max_Fields>;
  min?: Maybe<Addresses_Min_Fields>;
  stddev?: Maybe<Addresses_Stddev_Fields>;
  stddev_pop?: Maybe<Addresses_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Addresses_Stddev_Samp_Fields>;
  sum?: Maybe<Addresses_Sum_Fields>;
  var_pop?: Maybe<Addresses_Var_Pop_Fields>;
  var_samp?: Maybe<Addresses_Var_Samp_Fields>;
  variance?: Maybe<Addresses_Variance_Fields>;
};


/** aggregate fields of "addresses" */
export type Addresses_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Addresses_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "addresses" */
export type Addresses_Aggregate_Order_By = {
  avg?: InputMaybe<Addresses_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Addresses_Max_Order_By>;
  min?: InputMaybe<Addresses_Min_Order_By>;
  stddev?: InputMaybe<Addresses_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Addresses_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Addresses_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Addresses_Sum_Order_By>;
  var_pop?: InputMaybe<Addresses_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Addresses_Var_Samp_Order_By>;
  variance?: InputMaybe<Addresses_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "addresses" */
export type Addresses_Arr_Rel_Insert_Input = {
  data: Array<Addresses_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Addresses_On_Conflict>;
};

/** aggregate avg on columns */
export type Addresses_Avg_Fields = {
  __typename?: 'addresses_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "addresses" */
export type Addresses_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "addresses". All fields are combined with a logical 'AND'. */
export type Addresses_Bool_Exp = {
  _and?: InputMaybe<Array<Addresses_Bool_Exp>>;
  _not?: InputMaybe<Addresses_Bool_Exp>;
  _or?: InputMaybe<Array<Addresses_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_default?: InputMaybe<Boolean_Comparison_Exp>;
  receiver_address?: InputMaybe<String_Comparison_Exp>;
  receiver_city?: InputMaybe<String_Comparison_Exp>;
  receiver_district?: InputMaybe<String_Comparison_Exp>;
  receiver_name?: InputMaybe<String_Comparison_Exp>;
  receiver_phone?: InputMaybe<String_Comparison_Exp>;
  receiver_province?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_users?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "addresses" */
export enum Addresses_Constraint {
  /** unique or primary key constraint on columns "id" */
  AddressesPkey = 'addresses_pkey'
}

/** input type for incrementing numeric columns in table "addresses" */
export type Addresses_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "addresses" */
export type Addresses_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否默认 */
  is_default?: InputMaybe<Scalars['Boolean']['input']>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Addresses_Max_Fields = {
  __typename?: 'addresses_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name?: Maybe<Scalars['String']['output']>;
  /** 收货电话 */
  receiver_phone?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "addresses" */
export type Addresses_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: InputMaybe<Order_By>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Order_By>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Order_By>;
  /** 收货人 */
  receiver_name?: InputMaybe<Order_By>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Order_By>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Addresses_Min_Fields = {
  __typename?: 'addresses_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name?: Maybe<Scalars['String']['output']>;
  /** 收货电话 */
  receiver_phone?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "addresses" */
export type Addresses_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: InputMaybe<Order_By>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Order_By>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Order_By>;
  /** 收货人 */
  receiver_name?: InputMaybe<Order_By>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Order_By>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "addresses" */
export type Addresses_Mutation_Response = {
  __typename?: 'addresses_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Addresses>;
};

/** on_conflict condition type for table "addresses" */
export type Addresses_On_Conflict = {
  constraint: Addresses_Constraint;
  update_columns?: Array<Addresses_Update_Column>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};

/** Ordering options when selecting data from "addresses". */
export type Addresses_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_default?: InputMaybe<Order_By>;
  receiver_address?: InputMaybe<Order_By>;
  receiver_city?: InputMaybe<Order_By>;
  receiver_district?: InputMaybe<Order_By>;
  receiver_name?: InputMaybe<Order_By>;
  receiver_phone?: InputMaybe<Order_By>;
  receiver_province?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** primary key columns input for table: addresses */
export type Addresses_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "addresses" */
export enum Addresses_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  ReceiverAddress = 'receiver_address',
  /** column name */
  ReceiverCity = 'receiver_city',
  /** column name */
  ReceiverDistrict = 'receiver_district',
  /** column name */
  ReceiverName = 'receiver_name',
  /** column name */
  ReceiverPhone = 'receiver_phone',
  /** column name */
  ReceiverProvince = 'receiver_province',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

/** select "addresses_aggregate_bool_exp_bool_and_arguments_columns" columns of table "addresses" */
export enum Addresses_Select_Column_Addresses_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default'
}

/** select "addresses_aggregate_bool_exp_bool_or_arguments_columns" columns of table "addresses" */
export enum Addresses_Select_Column_Addresses_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default'
}

/** input type for updating data in table "addresses" */
export type Addresses_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否默认 */
  is_default?: InputMaybe<Scalars['Boolean']['input']>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Addresses_Stddev_Fields = {
  __typename?: 'addresses_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "addresses" */
export type Addresses_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Addresses_Stddev_Pop_Fields = {
  __typename?: 'addresses_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "addresses" */
export type Addresses_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Addresses_Stddev_Samp_Fields = {
  __typename?: 'addresses_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "addresses" */
export type Addresses_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "addresses" */
export type Addresses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Addresses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Addresses_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否默认 */
  is_default?: InputMaybe<Scalars['Boolean']['input']>;
  /** 收货地址，完整省市区和详细地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Addresses_Sum_Fields = {
  __typename?: 'addresses_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "addresses" */
export type Addresses_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** update columns of table "addresses" */
export enum Addresses_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  ReceiverAddress = 'receiver_address',
  /** column name */
  ReceiverCity = 'receiver_city',
  /** column name */
  ReceiverDistrict = 'receiver_district',
  /** column name */
  ReceiverName = 'receiver_name',
  /** column name */
  ReceiverPhone = 'receiver_phone',
  /** column name */
  ReceiverProvince = 'receiver_province',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

export type Addresses_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Addresses_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Addresses_Set_Input>;
  /** filter the rows which have to be updated */
  where: Addresses_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Addresses_Var_Pop_Fields = {
  __typename?: 'addresses_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "addresses" */
export type Addresses_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Addresses_Var_Samp_Fields = {
  __typename?: 'addresses_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "addresses" */
export type Addresses_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Addresses_Variance_Fields = {
  __typename?: 'addresses_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "addresses" */
export type Addresses_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _eq?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _gt?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _gte?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['bigint']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _lte?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _neq?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['bigint']['input']>>>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** 购物车表 */
export type Carts = {
  __typename?: 'carts';
  /** 所属公司id */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  product_sku: Product_Skus;
  /** 产品规格id */
  product_sku_product_skus: Scalars['bigint']['output'];
  /** 数量 */
  quantity: Scalars['bigint']['output'];
  /** 是否选中 */
  selected: Scalars['Boolean']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  /** 用户id */
  user_users: Scalars['bigint']['output'];
};

/** aggregated selection of "carts" */
export type Carts_Aggregate = {
  __typename?: 'carts_aggregate';
  aggregate?: Maybe<Carts_Aggregate_Fields>;
  nodes: Array<Carts>;
};

export type Carts_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Carts_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Carts_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Carts_Aggregate_Bool_Exp_Count>;
};

export type Carts_Aggregate_Bool_Exp_Bool_And = {
  arguments: Carts_Select_Column_Carts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Carts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Carts_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Carts_Select_Column_Carts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Carts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Carts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Carts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Carts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "carts" */
export type Carts_Aggregate_Fields = {
  __typename?: 'carts_aggregate_fields';
  avg?: Maybe<Carts_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Carts_Max_Fields>;
  min?: Maybe<Carts_Min_Fields>;
  stddev?: Maybe<Carts_Stddev_Fields>;
  stddev_pop?: Maybe<Carts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Carts_Stddev_Samp_Fields>;
  sum?: Maybe<Carts_Sum_Fields>;
  var_pop?: Maybe<Carts_Var_Pop_Fields>;
  var_samp?: Maybe<Carts_Var_Samp_Fields>;
  variance?: Maybe<Carts_Variance_Fields>;
};


/** aggregate fields of "carts" */
export type Carts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Carts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "carts" */
export type Carts_Aggregate_Order_By = {
  avg?: InputMaybe<Carts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Carts_Max_Order_By>;
  min?: InputMaybe<Carts_Min_Order_By>;
  stddev?: InputMaybe<Carts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Carts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Carts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Carts_Sum_Order_By>;
  var_pop?: InputMaybe<Carts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Carts_Var_Samp_Order_By>;
  variance?: InputMaybe<Carts_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "carts" */
export type Carts_Arr_Rel_Insert_Input = {
  data: Array<Carts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Carts_On_Conflict>;
};

/** aggregate avg on columns */
export type Carts_Avg_Fields = {
  __typename?: 'carts_avg_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "carts" */
export type Carts_Avg_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "carts". All fields are combined with a logical 'AND'. */
export type Carts_Bool_Exp = {
  _and?: InputMaybe<Array<Carts_Bool_Exp>>;
  _not?: InputMaybe<Carts_Bool_Exp>;
  _or?: InputMaybe<Array<Carts_Bool_Exp>>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  product_sku?: InputMaybe<Product_Skus_Bool_Exp>;
  product_sku_product_skus?: InputMaybe<Bigint_Comparison_Exp>;
  quantity?: InputMaybe<Bigint_Comparison_Exp>;
  selected?: InputMaybe<Boolean_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_users?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "carts" */
export enum Carts_Constraint {
  /** unique or primary key constraint on columns "id" */
  CartsPkey = 'carts_pkey',
  /** unique or primary key constraint on columns "user_users", "company_companies", "product_sku_product_skus" */
  CartsProductSkuProductSkusUserUsersCompanyCompaniesKey = 'carts_product_sku_product_skus_user_users_company_companies_key'
}

/** input type for incrementing numeric columns in table "carts" */
export type Carts_Inc_Input = {
  /** 所属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "carts" */
export type Carts_Insert_Input = {
  /** 所属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  product_sku?: InputMaybe<Product_Skus_Obj_Rel_Insert_Input>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否选中 */
  selected?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Carts_Max_Fields = {
  __typename?: 'carts_max_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "carts" */
export type Carts_Max_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Carts_Min_Fields = {
  __typename?: 'carts_min_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "carts" */
export type Carts_Min_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "carts" */
export type Carts_Mutation_Response = {
  __typename?: 'carts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Carts>;
};

/** on_conflict condition type for table "carts" */
export type Carts_On_Conflict = {
  constraint: Carts_Constraint;
  update_columns?: Array<Carts_Update_Column>;
  where?: InputMaybe<Carts_Bool_Exp>;
};

/** Ordering options when selecting data from "carts". */
export type Carts_Order_By = {
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  product_sku?: InputMaybe<Product_Skus_Order_By>;
  product_sku_product_skus?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  selected?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** primary key columns input for table: carts */
export type Carts_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "carts" */
export enum Carts_Select_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Selected = 'selected',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

/** select "carts_aggregate_bool_exp_bool_and_arguments_columns" columns of table "carts" */
export enum Carts_Select_Column_Carts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Selected = 'selected'
}

/** select "carts_aggregate_bool_exp_bool_or_arguments_columns" columns of table "carts" */
export enum Carts_Select_Column_Carts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Selected = 'selected'
}

/** input type for updating data in table "carts" */
export type Carts_Set_Input = {
  /** 所属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否选中 */
  selected?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Carts_Stddev_Fields = {
  __typename?: 'carts_stddev_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "carts" */
export type Carts_Stddev_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Carts_Stddev_Pop_Fields = {
  __typename?: 'carts_stddev_pop_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "carts" */
export type Carts_Stddev_Pop_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Carts_Stddev_Samp_Fields = {
  __typename?: 'carts_stddev_samp_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "carts" */
export type Carts_Stddev_Samp_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "carts" */
export type Carts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Carts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Carts_Stream_Cursor_Value_Input = {
  /** 所属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否选中 */
  selected?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Carts_Sum_Fields = {
  __typename?: 'carts_sum_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "carts" */
export type Carts_Sum_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** update columns of table "carts" */
export enum Carts_Update_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Selected = 'selected',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

export type Carts_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Carts_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Carts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Carts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Carts_Var_Pop_Fields = {
  __typename?: 'carts_var_pop_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "carts" */
export type Carts_Var_Pop_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Carts_Var_Samp_Fields = {
  __typename?: 'carts_var_samp_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "carts" */
export type Carts_Var_Samp_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Carts_Variance_Fields = {
  __typename?: 'carts_variance_fields';
  /** 所属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 产品规格id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "carts" */
export type Carts_Variance_Order_By = {
  /** 所属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品规格id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** 分类表 */
export type Categories = {
  __typename?: 'categories';
  /** An array relationship */
  categories: Array<Categories>;
  /** An aggregate relationship */
  categories_aggregate: Categories_Aggregate;
  /** An object relationship */
  category?: Maybe<Categories>;
  /** An object relationship */
  company: Companies;
  /** 归属公司id */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** 分类的图标 */
  icon_url: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  /** 是否删除 */
  is_deleted: Scalars['Boolean']['output'];
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level: Scalars['bigint']['output'];
  /** 分类名称 */
  name: Scalars['String']['output'];
  /** An array relationship */
  packages: Array<Packages>;
  /** An aggregate relationship */
  packages_aggregate: Packages_Aggregate;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  products: Array<Products>;
  /** An aggregate relationship */
  products_aggregate: Products_Aggregate;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style: Scalars['String']['output'];
  /** 排序，越小的在前 */
  sort_order: Scalars['bigint']['output'];
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 分类表 */
export type CategoriesCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


/** 分类表 */
export type CategoriesCategories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


/** 分类表 */
export type CategoriesPackagesArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


/** 分类表 */
export type CategoriesPackages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


/** 分类表 */
export type CategoriesProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


/** 分类表 */
export type CategoriesProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};

/** aggregated selection of "categories" */
export type Categories_Aggregate = {
  __typename?: 'categories_aggregate';
  aggregate?: Maybe<Categories_Aggregate_Fields>;
  nodes: Array<Categories>;
};

export type Categories_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Categories_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Categories_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Categories_Aggregate_Bool_Exp_Count>;
};

export type Categories_Aggregate_Bool_Exp_Bool_And = {
  arguments: Categories_Select_Column_Categories_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Categories_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Categories_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Categories_Select_Column_Categories_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Categories_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Categories_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Categories_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Categories_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "categories" */
export type Categories_Aggregate_Fields = {
  __typename?: 'categories_aggregate_fields';
  avg?: Maybe<Categories_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Categories_Max_Fields>;
  min?: Maybe<Categories_Min_Fields>;
  stddev?: Maybe<Categories_Stddev_Fields>;
  stddev_pop?: Maybe<Categories_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Categories_Stddev_Samp_Fields>;
  sum?: Maybe<Categories_Sum_Fields>;
  var_pop?: Maybe<Categories_Var_Pop_Fields>;
  var_samp?: Maybe<Categories_Var_Samp_Fields>;
  variance?: Maybe<Categories_Variance_Fields>;
};


/** aggregate fields of "categories" */
export type Categories_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Categories_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "categories" */
export type Categories_Aggregate_Order_By = {
  avg?: InputMaybe<Categories_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Categories_Max_Order_By>;
  min?: InputMaybe<Categories_Min_Order_By>;
  stddev?: InputMaybe<Categories_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Categories_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Categories_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Categories_Sum_Order_By>;
  var_pop?: InputMaybe<Categories_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Categories_Var_Samp_Order_By>;
  variance?: InputMaybe<Categories_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "categories" */
export type Categories_Arr_Rel_Insert_Input = {
  data: Array<Categories_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};

/** aggregate avg on columns */
export type Categories_Avg_Fields = {
  __typename?: 'categories_avg_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "categories" */
export type Categories_Avg_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "categories". All fields are combined with a logical 'AND'. */
export type Categories_Bool_Exp = {
  _and?: InputMaybe<Array<Categories_Bool_Exp>>;
  _not?: InputMaybe<Categories_Bool_Exp>;
  _or?: InputMaybe<Array<Categories_Bool_Exp>>;
  categories?: InputMaybe<Categories_Bool_Exp>;
  categories_aggregate?: InputMaybe<Categories_Aggregate_Bool_Exp>;
  category?: InputMaybe<Categories_Bool_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  icon_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  level?: InputMaybe<Bigint_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  packages?: InputMaybe<Packages_Bool_Exp>;
  packages_aggregate?: InputMaybe<Packages_Aggregate_Bool_Exp>;
  parent_categories?: InputMaybe<Bigint_Comparison_Exp>;
  products?: InputMaybe<Products_Bool_Exp>;
  products_aggregate?: InputMaybe<Products_Aggregate_Bool_Exp>;
  route_ui_style?: InputMaybe<String_Comparison_Exp>;
  sort_order?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "categories" */
export enum Categories_Constraint {
  /** unique or primary key constraint on columns "id" */
  CategoriesPkey = 'categories_pkey'
}

/** input type for incrementing numeric columns in table "categories" */
export type Categories_Inc_Input = {
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Scalars['bigint']['input']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "categories" */
export type Categories_Insert_Input = {
  categories?: InputMaybe<Categories_Arr_Rel_Insert_Input>;
  category?: InputMaybe<Categories_Obj_Rel_Insert_Input>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 分类的图标 */
  icon_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  packages?: InputMaybe<Packages_Arr_Rel_Insert_Input>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Scalars['bigint']['input']>;
  products?: InputMaybe<Products_Arr_Rel_Insert_Input>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: InputMaybe<Scalars['String']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Categories_Max_Fields = {
  __typename?: 'categories_max_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 分类的图标 */
  icon_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['bigint']['output']>;
  /** 分类名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['bigint']['output']>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: Maybe<Scalars['String']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "categories" */
export type Categories_Max_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 分类的图标 */
  icon_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 分类名称 */
  name?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Categories_Min_Fields = {
  __typename?: 'categories_min_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 分类的图标 */
  icon_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['bigint']['output']>;
  /** 分类名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['bigint']['output']>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: Maybe<Scalars['String']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "categories" */
export type Categories_Min_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 分类的图标 */
  icon_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 分类名称 */
  name?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "categories" */
export type Categories_Mutation_Response = {
  __typename?: 'categories_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Categories>;
};

/** input type for inserting object relation for remote table "categories" */
export type Categories_Obj_Rel_Insert_Input = {
  data: Categories_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};

/** on_conflict condition type for table "categories" */
export type Categories_On_Conflict = {
  constraint: Categories_Constraint;
  update_columns?: Array<Categories_Update_Column>;
  where?: InputMaybe<Categories_Bool_Exp>;
};

/** Ordering options when selecting data from "categories". */
export type Categories_Order_By = {
  categories_aggregate?: InputMaybe<Categories_Aggregate_Order_By>;
  category?: InputMaybe<Categories_Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  icon_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  packages_aggregate?: InputMaybe<Packages_Aggregate_Order_By>;
  parent_categories?: InputMaybe<Order_By>;
  products_aggregate?: InputMaybe<Products_Aggregate_Order_By>;
  route_ui_style?: InputMaybe<Order_By>;
  sort_order?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: categories */
export type Categories_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "categories" */
export enum Categories_Select_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IconUrl = 'icon_url',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Level = 'level',
  /** column name */
  Name = 'name',
  /** column name */
  ParentCategories = 'parent_categories',
  /** column name */
  RouteUiStyle = 'route_ui_style',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "categories_aggregate_bool_exp_bool_and_arguments_columns" columns of table "categories" */
export enum Categories_Select_Column_Categories_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted'
}

/** select "categories_aggregate_bool_exp_bool_or_arguments_columns" columns of table "categories" */
export enum Categories_Select_Column_Categories_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted'
}

/** input type for updating data in table "categories" */
export type Categories_Set_Input = {
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 分类的图标 */
  icon_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: InputMaybe<Scalars['String']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Categories_Stddev_Fields = {
  __typename?: 'categories_stddev_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "categories" */
export type Categories_Stddev_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Categories_Stddev_Pop_Fields = {
  __typename?: 'categories_stddev_pop_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "categories" */
export type Categories_Stddev_Pop_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Categories_Stddev_Samp_Fields = {
  __typename?: 'categories_stddev_samp_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "categories" */
export type Categories_Stddev_Samp_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "categories" */
export type Categories_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Categories_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Categories_Stream_Cursor_Value_Input = {
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 分类的图标 */
  icon_url?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 点击该分类后展示的UI样式，1.categories（继续展示分类）2.products（展示该分类下的产品） */
  route_ui_style?: InputMaybe<Scalars['String']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 分类类型，1、product（产品分类） 2.package（套餐分类） */
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Categories_Sum_Fields = {
  __typename?: 'categories_sum_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['bigint']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "categories" */
export type Categories_Sum_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** update columns of table "categories" */
export enum Categories_Update_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IconUrl = 'icon_url',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Level = 'level',
  /** column name */
  Name = 'name',
  /** column name */
  ParentCategories = 'parent_categories',
  /** column name */
  RouteUiStyle = 'route_ui_style',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Categories_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Categories_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Categories_Set_Input>;
  /** filter the rows which have to be updated */
  where: Categories_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Categories_Var_Pop_Fields = {
  __typename?: 'categories_var_pop_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "categories" */
export type Categories_Var_Pop_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Categories_Var_Samp_Fields = {
  __typename?: 'categories_var_samp_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "categories" */
export type Categories_Var_Samp_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Categories_Variance_Fields = {
  __typename?: 'categories_variance_fields';
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: Maybe<Scalars['Float']['output']>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "categories" */
export type Categories_Variance_Order_By = {
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 分类层级（0为顶级），最多三级，0 1 2 */
  level?: InputMaybe<Order_By>;
  /** 父级分类id，为空时对应的level=0 */
  parent_categories?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
};

/** 公司信息表 */
export type Companies = {
  __typename?: 'companies';
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom: Array<Scalars['json']['output']>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top: Array<Scalars['json']['output']>;
  /** An array relationship */
  categories: Array<Categories>;
  /** An aggregate relationship */
  categories_aggregate: Categories_Aggregate;
  /** An array relationship */
  company_leads: Array<Company_Leads>;
  /** An aggregate relationship */
  company_leads_aggregate: Company_Leads_Aggregate;
  /** An array relationship */
  company_packages: Array<Company_Packages>;
  /** An aggregate relationship */
  company_packages_aggregate: Company_Packages_Aggregate;
  /** An array relationship */
  company_products: Array<Company_Products>;
  /** An aggregate relationship */
  company_products_aggregate: Company_Products_Aggregate;
  /** An array relationship */
  company_users: Array<Company_Users>;
  /** An aggregate relationship */
  company_users_aggregate: Company_Users_Aggregate;
  /** 联系我们 二维码 */
  contact_code?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 公司配置的初始用户/未登录用户能否查看价格，取决于mode_for_price */
  default_for_can_view_price: Scalars['Boolean']['output'];
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor: Scalars['numeric']['output'];
  /** 富文本，公司介绍 */
  description?: Maybe<Scalars['String']['output']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  id: Scalars['bigint']['output'];
  /** 公司logo */
  logo_url?: Maybe<Scalars['String']['output']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price: Scalars['String']['output'];
  /** 公司名称 */
  name: Scalars['String']['output'];
  /** An array relationship */
  orders: Array<Orders>;
  /** An aggregate relationship */
  orders_aggregate: Orders_Aggregate;
  /** An array relationship */
  packages: Array<Packages>;
  /** An aggregate relationship */
  packages_aggregate: Packages_Aggregate;
  /** An array relationship */
  product_skus: Array<Product_Skus>;
  /** An aggregate relationship */
  product_skus_aggregate: Product_Skus_Aggregate;
  /** An array relationship */
  products: Array<Products>;
  /** An aggregate relationship */
  products_aggregate: Products_Aggregate;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  /** 微信加好友二维码 */
  wechat_code?: Maybe<Scalars['String']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};


/** 公司信息表 */
export type CompaniesCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCategories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_LeadsArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_Leads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_PackagesArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_Packages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_UsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesCompany_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesOrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesPackagesArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesPackages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesProduct_SkusArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesProduct_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


/** 公司信息表 */
export type CompaniesProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};

/** aggregated selection of "companies" */
export type Companies_Aggregate = {
  __typename?: 'companies_aggregate';
  aggregate?: Maybe<Companies_Aggregate_Fields>;
  nodes: Array<Companies>;
};

/** aggregate fields of "companies" */
export type Companies_Aggregate_Fields = {
  __typename?: 'companies_aggregate_fields';
  avg?: Maybe<Companies_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Companies_Max_Fields>;
  min?: Maybe<Companies_Min_Fields>;
  stddev?: Maybe<Companies_Stddev_Fields>;
  stddev_pop?: Maybe<Companies_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Companies_Stddev_Samp_Fields>;
  sum?: Maybe<Companies_Sum_Fields>;
  var_pop?: Maybe<Companies_Var_Pop_Fields>;
  var_samp?: Maybe<Companies_Var_Samp_Fields>;
  variance?: Maybe<Companies_Variance_Fields>;
};


/** aggregate fields of "companies" */
export type Companies_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Companies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Companies_Avg_Fields = {
  __typename?: 'companies_avg_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "companies". All fields are combined with a logical 'AND'. */
export type Companies_Bool_Exp = {
  _and?: InputMaybe<Array<Companies_Bool_Exp>>;
  _not?: InputMaybe<Companies_Bool_Exp>;
  _or?: InputMaybe<Array<Companies_Bool_Exp>>;
  banner_bottom?: InputMaybe<Json_Array_Comparison_Exp>;
  banner_top?: InputMaybe<Json_Array_Comparison_Exp>;
  categories?: InputMaybe<Categories_Bool_Exp>;
  categories_aggregate?: InputMaybe<Categories_Aggregate_Bool_Exp>;
  company_leads?: InputMaybe<Company_Leads_Bool_Exp>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Bool_Exp>;
  company_packages?: InputMaybe<Company_Packages_Bool_Exp>;
  company_packages_aggregate?: InputMaybe<Company_Packages_Aggregate_Bool_Exp>;
  company_products?: InputMaybe<Company_Products_Bool_Exp>;
  company_products_aggregate?: InputMaybe<Company_Products_Aggregate_Bool_Exp>;
  company_users?: InputMaybe<Company_Users_Bool_Exp>;
  company_users_aggregate?: InputMaybe<Company_Users_Aggregate_Bool_Exp>;
  contact_code?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  default_for_can_view_price?: InputMaybe<Boolean_Comparison_Exp>;
  default_for_price_factor?: InputMaybe<Numeric_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  hidden_category_ids?: InputMaybe<Bigint_Array_Comparison_Exp>;
  hidden_package_ids?: InputMaybe<Bigint_Array_Comparison_Exp>;
  hidden_product_ids?: InputMaybe<Bigint_Array_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  logo_url?: InputMaybe<String_Comparison_Exp>;
  mode_for_price?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  orders?: InputMaybe<Orders_Bool_Exp>;
  orders_aggregate?: InputMaybe<Orders_Aggregate_Bool_Exp>;
  packages?: InputMaybe<Packages_Bool_Exp>;
  packages_aggregate?: InputMaybe<Packages_Aggregate_Bool_Exp>;
  product_skus?: InputMaybe<Product_Skus_Bool_Exp>;
  product_skus_aggregate?: InputMaybe<Product_Skus_Aggregate_Bool_Exp>;
  products?: InputMaybe<Products_Bool_Exp>;
  products_aggregate?: InputMaybe<Products_Aggregate_Bool_Exp>;
  resource_file_url?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  wechat_code?: InputMaybe<String_Comparison_Exp>;
  wx_scan_code?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "companies" */
export enum Companies_Constraint {
  /** unique or primary key constraint on columns "name" */
  CompaniesNameKey = 'companies_name_key',
  /** unique or primary key constraint on columns "id" */
  CompaniesPkey = 'companies_pkey'
}

/** input type for incrementing numeric columns in table "companies" */
export type Companies_Inc_Input = {
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "companies" */
export type Companies_Insert_Input = {
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top?: InputMaybe<Array<Scalars['json']['input']>>;
  categories?: InputMaybe<Categories_Arr_Rel_Insert_Input>;
  company_leads?: InputMaybe<Company_Leads_Arr_Rel_Insert_Input>;
  company_packages?: InputMaybe<Company_Packages_Arr_Rel_Insert_Input>;
  company_products?: InputMaybe<Company_Products_Arr_Rel_Insert_Input>;
  company_users?: InputMaybe<Company_Users_Arr_Rel_Insert_Input>;
  /** 联系我们 二维码 */
  contact_code?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 公司配置的初始用户/未登录用户能否查看价格，取决于mode_for_price */
  default_for_can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 富文本，公司介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 公司logo */
  logo_url?: InputMaybe<Scalars['String']['input']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price?: InputMaybe<Scalars['String']['input']>;
  /** 公司名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  orders?: InputMaybe<Orders_Arr_Rel_Insert_Input>;
  packages?: InputMaybe<Packages_Arr_Rel_Insert_Input>;
  product_skus?: InputMaybe<Product_Skus_Arr_Rel_Insert_Input>;
  products?: InputMaybe<Products_Arr_Rel_Insert_Input>;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信加好友二维码 */
  wechat_code?: InputMaybe<Scalars['String']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Companies_Max_Fields = {
  __typename?: 'companies_max_fields';
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom?: Maybe<Array<Scalars['json']['output']>>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top?: Maybe<Array<Scalars['json']['output']>>;
  /** 联系我们 二维码 */
  contact_code?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 富文本，公司介绍 */
  description?: Maybe<Scalars['String']['output']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 公司logo */
  logo_url?: Maybe<Scalars['String']['output']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price?: Maybe<Scalars['String']['output']>;
  /** 公司名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信加好友二维码 */
  wechat_code?: Maybe<Scalars['String']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Companies_Min_Fields = {
  __typename?: 'companies_min_fields';
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom?: Maybe<Array<Scalars['json']['output']>>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top?: Maybe<Array<Scalars['json']['output']>>;
  /** 联系我们 二维码 */
  contact_code?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 富文本，公司介绍 */
  description?: Maybe<Scalars['String']['output']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: Maybe<Array<Scalars['bigint']['output']>>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 公司logo */
  logo_url?: Maybe<Scalars['String']['output']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price?: Maybe<Scalars['String']['output']>;
  /** 公司名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信加好友二维码 */
  wechat_code?: Maybe<Scalars['String']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "companies" */
export type Companies_Mutation_Response = {
  __typename?: 'companies_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Companies>;
};

/** input type for inserting object relation for remote table "companies" */
export type Companies_Obj_Rel_Insert_Input = {
  data: Companies_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Companies_On_Conflict>;
};

/** on_conflict condition type for table "companies" */
export type Companies_On_Conflict = {
  constraint: Companies_Constraint;
  update_columns?: Array<Companies_Update_Column>;
  where?: InputMaybe<Companies_Bool_Exp>;
};

/** Ordering options when selecting data from "companies". */
export type Companies_Order_By = {
  banner_bottom?: InputMaybe<Order_By>;
  banner_top?: InputMaybe<Order_By>;
  categories_aggregate?: InputMaybe<Categories_Aggregate_Order_By>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Order_By>;
  company_packages_aggregate?: InputMaybe<Company_Packages_Aggregate_Order_By>;
  company_products_aggregate?: InputMaybe<Company_Products_Aggregate_Order_By>;
  company_users_aggregate?: InputMaybe<Company_Users_Aggregate_Order_By>;
  contact_code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_for_can_view_price?: InputMaybe<Order_By>;
  default_for_price_factor?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  hidden_category_ids?: InputMaybe<Order_By>;
  hidden_package_ids?: InputMaybe<Order_By>;
  hidden_product_ids?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  logo_url?: InputMaybe<Order_By>;
  mode_for_price?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  orders_aggregate?: InputMaybe<Orders_Aggregate_Order_By>;
  packages_aggregate?: InputMaybe<Packages_Aggregate_Order_By>;
  product_skus_aggregate?: InputMaybe<Product_Skus_Aggregate_Order_By>;
  products_aggregate?: InputMaybe<Products_Aggregate_Order_By>;
  resource_file_url?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  wechat_code?: InputMaybe<Order_By>;
  wx_scan_code?: InputMaybe<Order_By>;
};

/** primary key columns input for table: companies */
export type Companies_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "companies" */
export enum Companies_Select_Column {
  /** column name */
  BannerBottom = 'banner_bottom',
  /** column name */
  BannerTop = 'banner_top',
  /** column name */
  ContactCode = 'contact_code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DefaultForCanViewPrice = 'default_for_can_view_price',
  /** column name */
  DefaultForPriceFactor = 'default_for_price_factor',
  /** column name */
  Description = 'description',
  /** column name */
  HiddenCategoryIds = 'hidden_category_ids',
  /** column name */
  HiddenPackageIds = 'hidden_package_ids',
  /** column name */
  HiddenProductIds = 'hidden_product_ids',
  /** column name */
  Id = 'id',
  /** column name */
  LogoUrl = 'logo_url',
  /** column name */
  ModeForPrice = 'mode_for_price',
  /** column name */
  Name = 'name',
  /** column name */
  ResourceFileUrl = 'resource_file_url',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WechatCode = 'wechat_code',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

/** input type for updating data in table "companies" */
export type Companies_Set_Input = {
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 联系我们 二维码 */
  contact_code?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 公司配置的初始用户/未登录用户能否查看价格，取决于mode_for_price */
  default_for_can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 富文本，公司介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 公司logo */
  logo_url?: InputMaybe<Scalars['String']['input']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price?: InputMaybe<Scalars['String']['input']>;
  /** 公司名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信加好友二维码 */
  wechat_code?: InputMaybe<Scalars['String']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Companies_Stddev_Fields = {
  __typename?: 'companies_stddev_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Companies_Stddev_Pop_Fields = {
  __typename?: 'companies_stddev_pop_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Companies_Stddev_Samp_Fields = {
  __typename?: 'companies_stddev_samp_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "companies" */
export type Companies_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Companies_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Companies_Stream_Cursor_Value_Input = {
  /** 底部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_bottom?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 顶部轮播图（json数组）export interface BannerItem { /** 文件类型（如：image、video） *\/ file_type?: string; /** 文件 URL *\/ file_url: string; /** 跳转链接（小程序路径或外部链接） *\/ link?: string; /** 排序索引 *\/ sort?: number; /** 标题 *\/ title?: string; } */
  banner_top?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 联系我们 二维码 */
  contact_code?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 公司配置的初始用户/未登录用户能否查看价格，取决于mode_for_price */
  default_for_can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 富文本，公司介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 隐藏的分类ids */
  hidden_category_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的套餐id */
  hidden_package_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  /** 隐藏的产品id */
  hidden_product_ids?: InputMaybe<Array<Scalars['bigint']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 公司logo */
  logo_url?: InputMaybe<Scalars['String']['input']>;
  /** 价格系数模式：1.company公司统一修改价格系数 2.user每个用户单独定制价格系数 */
  mode_for_price?: InputMaybe<Scalars['String']['input']>;
  /** 公司名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 资源库文件url，一般是pdf文档 */
  resource_file_url?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信加好友二维码 */
  wechat_code?: InputMaybe<Scalars['String']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Companies_Sum_Fields = {
  __typename?: 'companies_sum_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "companies" */
export enum Companies_Update_Column {
  /** column name */
  BannerBottom = 'banner_bottom',
  /** column name */
  BannerTop = 'banner_top',
  /** column name */
  ContactCode = 'contact_code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DefaultForCanViewPrice = 'default_for_can_view_price',
  /** column name */
  DefaultForPriceFactor = 'default_for_price_factor',
  /** column name */
  Description = 'description',
  /** column name */
  HiddenCategoryIds = 'hidden_category_ids',
  /** column name */
  HiddenPackageIds = 'hidden_package_ids',
  /** column name */
  HiddenProductIds = 'hidden_product_ids',
  /** column name */
  Id = 'id',
  /** column name */
  LogoUrl = 'logo_url',
  /** column name */
  ModeForPrice = 'mode_for_price',
  /** column name */
  Name = 'name',
  /** column name */
  ResourceFileUrl = 'resource_file_url',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WechatCode = 'wechat_code',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

export type Companies_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Companies_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Companies_Set_Input>;
  /** filter the rows which have to be updated */
  where: Companies_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Companies_Var_Pop_Fields = {
  __typename?: 'companies_var_pop_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Companies_Var_Samp_Fields = {
  __typename?: 'companies_var_samp_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Companies_Variance_Fields = {
  __typename?: 'companies_variance_fields';
  /** 公司配置的初始用户价格/全局系数，取决于mode_for_price */
  default_for_price_factor?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** 公司线索跟进记录表 */
export type Company_Lead_Tracks = {
  __typename?: 'company_lead_tracks';
  /** 示例：[   {     "file_type": "image",     "file_url": "https://...",     "name": "现场照片1.jpg",     "size": 102400,     "uploaded_at": "2026-04-17T12:00:00Z"   } ] */
  attachments: Scalars['json']['output'];
  /** An object relationship */
  company_lead: Company_Leads;
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads: Scalars['bigint']['output'];
  /** An object relationship */
  company_user: Company_Users;
  /** 跟进内容（必填业务上建议非空） */
  content: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** 谁写的这条跟进 */
  created_by_company_users: Scalars['bigint']['output'];
  id: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 公司线索跟进记录表 */
export type Company_Lead_TracksAttachmentsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "company_lead_tracks" */
export type Company_Lead_Tracks_Aggregate = {
  __typename?: 'company_lead_tracks_aggregate';
  aggregate?: Maybe<Company_Lead_Tracks_Aggregate_Fields>;
  nodes: Array<Company_Lead_Tracks>;
};

export type Company_Lead_Tracks_Aggregate_Bool_Exp = {
  count?: InputMaybe<Company_Lead_Tracks_Aggregate_Bool_Exp_Count>;
};

export type Company_Lead_Tracks_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "company_lead_tracks" */
export type Company_Lead_Tracks_Aggregate_Fields = {
  __typename?: 'company_lead_tracks_aggregate_fields';
  avg?: Maybe<Company_Lead_Tracks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Company_Lead_Tracks_Max_Fields>;
  min?: Maybe<Company_Lead_Tracks_Min_Fields>;
  stddev?: Maybe<Company_Lead_Tracks_Stddev_Fields>;
  stddev_pop?: Maybe<Company_Lead_Tracks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Company_Lead_Tracks_Stddev_Samp_Fields>;
  sum?: Maybe<Company_Lead_Tracks_Sum_Fields>;
  var_pop?: Maybe<Company_Lead_Tracks_Var_Pop_Fields>;
  var_samp?: Maybe<Company_Lead_Tracks_Var_Samp_Fields>;
  variance?: Maybe<Company_Lead_Tracks_Variance_Fields>;
};


/** aggregate fields of "company_lead_tracks" */
export type Company_Lead_Tracks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "company_lead_tracks" */
export type Company_Lead_Tracks_Aggregate_Order_By = {
  avg?: InputMaybe<Company_Lead_Tracks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Company_Lead_Tracks_Max_Order_By>;
  min?: InputMaybe<Company_Lead_Tracks_Min_Order_By>;
  stddev?: InputMaybe<Company_Lead_Tracks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Company_Lead_Tracks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Company_Lead_Tracks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Company_Lead_Tracks_Sum_Order_By>;
  var_pop?: InputMaybe<Company_Lead_Tracks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Company_Lead_Tracks_Var_Samp_Order_By>;
  variance?: InputMaybe<Company_Lead_Tracks_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "company_lead_tracks" */
export type Company_Lead_Tracks_Arr_Rel_Insert_Input = {
  data: Array<Company_Lead_Tracks_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Lead_Tracks_On_Conflict>;
};

/** aggregate avg on columns */
export type Company_Lead_Tracks_Avg_Fields = {
  __typename?: 'company_lead_tracks_avg_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Avg_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "company_lead_tracks". All fields are combined with a logical 'AND'. */
export type Company_Lead_Tracks_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Lead_Tracks_Bool_Exp>>;
  _not?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Lead_Tracks_Bool_Exp>>;
  attachments?: InputMaybe<Json_Comparison_Exp>;
  company_lead?: InputMaybe<Company_Leads_Bool_Exp>;
  company_lead_company_leads?: InputMaybe<Bigint_Comparison_Exp>;
  company_user?: InputMaybe<Company_Users_Bool_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by_company_users?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "company_lead_tracks" */
export enum Company_Lead_Tracks_Constraint {
  /** unique or primary key constraint on columns "id" */
  CompanyLeadTracksPkey = 'company_lead_tracks_pkey'
}

/** input type for incrementing numeric columns in table "company_lead_tracks" */
export type Company_Lead_Tracks_Inc_Input = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Scalars['bigint']['input']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "company_lead_tracks" */
export type Company_Lead_Tracks_Insert_Input = {
  /** 示例：[   {     "file_type": "image",     "file_url": "https://...",     "name": "现场照片1.jpg",     "size": 102400,     "uploaded_at": "2026-04-17T12:00:00Z"   } ] */
  attachments?: InputMaybe<Scalars['json']['input']>;
  company_lead?: InputMaybe<Company_Leads_Obj_Rel_Insert_Input>;
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Scalars['bigint']['input']>;
  company_user?: InputMaybe<Company_Users_Obj_Rel_Insert_Input>;
  /** 跟进内容（必填业务上建议非空） */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Company_Lead_Tracks_Max_Fields = {
  __typename?: 'company_lead_tracks_max_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['bigint']['output']>;
  /** 跟进内容（必填业务上建议非空） */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Max_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 跟进内容（必填业务上建议非空） */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Company_Lead_Tracks_Min_Fields = {
  __typename?: 'company_lead_tracks_min_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['bigint']['output']>;
  /** 跟进内容（必填业务上建议非空） */
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Min_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 跟进内容（必填业务上建议非空） */
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "company_lead_tracks" */
export type Company_Lead_Tracks_Mutation_Response = {
  __typename?: 'company_lead_tracks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Company_Lead_Tracks>;
};

/** on_conflict condition type for table "company_lead_tracks" */
export type Company_Lead_Tracks_On_Conflict = {
  constraint: Company_Lead_Tracks_Constraint;
  update_columns?: Array<Company_Lead_Tracks_Update_Column>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};

/** Ordering options when selecting data from "company_lead_tracks". */
export type Company_Lead_Tracks_Order_By = {
  attachments?: InputMaybe<Order_By>;
  company_lead?: InputMaybe<Company_Leads_Order_By>;
  company_lead_company_leads?: InputMaybe<Order_By>;
  company_user?: InputMaybe<Company_Users_Order_By>;
  content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: company_lead_tracks */
export type Company_Lead_Tracks_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "company_lead_tracks" */
export enum Company_Lead_Tracks_Select_Column {
  /** column name */
  Attachments = 'attachments',
  /** column name */
  CompanyLeadCompanyLeads = 'company_lead_company_leads',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedByCompanyUsers = 'created_by_company_users',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "company_lead_tracks" */
export type Company_Lead_Tracks_Set_Input = {
  /** 示例：[   {     "file_type": "image",     "file_url": "https://...",     "name": "现场照片1.jpg",     "size": 102400,     "uploaded_at": "2026-04-17T12:00:00Z"   } ] */
  attachments?: InputMaybe<Scalars['json']['input']>;
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Scalars['bigint']['input']>;
  /** 跟进内容（必填业务上建议非空） */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Company_Lead_Tracks_Stddev_Fields = {
  __typename?: 'company_lead_tracks_stddev_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Stddev_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Company_Lead_Tracks_Stddev_Pop_Fields = {
  __typename?: 'company_lead_tracks_stddev_pop_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Stddev_Pop_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Company_Lead_Tracks_Stddev_Samp_Fields = {
  __typename?: 'company_lead_tracks_stddev_samp_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Stddev_Samp_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "company_lead_tracks" */
export type Company_Lead_Tracks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Lead_Tracks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Lead_Tracks_Stream_Cursor_Value_Input = {
  /** 示例：[   {     "file_type": "image",     "file_url": "https://...",     "name": "现场照片1.jpg",     "size": 102400,     "uploaded_at": "2026-04-17T12:00:00Z"   } ] */
  attachments?: InputMaybe<Scalars['json']['input']>;
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Scalars['bigint']['input']>;
  /** 跟进内容（必填业务上建议非空） */
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Company_Lead_Tracks_Sum_Fields = {
  __typename?: 'company_lead_tracks_sum_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['bigint']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Sum_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** update columns of table "company_lead_tracks" */
export enum Company_Lead_Tracks_Update_Column {
  /** column name */
  Attachments = 'attachments',
  /** column name */
  CompanyLeadCompanyLeads = 'company_lead_company_leads',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedByCompanyUsers = 'created_by_company_users',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Company_Lead_Tracks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Company_Lead_Tracks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Lead_Tracks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Lead_Tracks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Company_Lead_Tracks_Var_Pop_Fields = {
  __typename?: 'company_lead_tracks_var_pop_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Var_Pop_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Company_Lead_Tracks_Var_Samp_Fields = {
  __typename?: 'company_lead_tracks_var_samp_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Var_Samp_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Company_Lead_Tracks_Variance_Fields = {
  __typename?: 'company_lead_tracks_variance_fields';
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: Maybe<Scalars['Float']['output']>;
  /** 谁写的这条跟进 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "company_lead_tracks" */
export type Company_Lead_Tracks_Variance_Order_By = {
  /** 关联外键，哪个线索的跟进 */
  company_lead_company_leads?: InputMaybe<Order_By>;
  /** 谁写的这条跟进 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** 公司线索记录表 */
export type Company_Leads = {
  __typename?: 'company_leads';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  company: Companies;
  /** An object relationship */
  companyUserByConvertedCompanyUsers?: Maybe<Company_Users>;
  /** An object relationship */
  companyUserByCreatedByCompanyUsers?: Maybe<Company_Users>;
  /** 关联外建，哪个公司的线索 */
  company_companies: Scalars['bigint']['output'];
  /** An array relationship */
  company_lead_tracks: Array<Company_Lead_Tracks>;
  /** An aggregate relationship */
  company_lead_tracks_aggregate: Company_Lead_Tracks_Aggregate;
  /** An object relationship */
  company_user?: Maybe<Company_Users>;
  /** 线索转客户的时间 */
  converted_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['bigint']['output']>;
  created_at: Scalars['timestamptz']['output'];
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id: Scalars['bigint']['output'];
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['bigint']['output']>;
  /** 线索身份-名字 */
  name: Scalars['String']['output'];
  /** 线索身份-电话 */
  phone: Scalars['String']['output'];
  /** new / assigned / following / won / lost / converted */
  status: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
};


/** 公司线索记录表 */
export type Company_LeadsCompany_Lead_TracksArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


/** 公司线索记录表 */
export type Company_LeadsCompany_Lead_Tracks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};

/** aggregated selection of "company_leads" */
export type Company_Leads_Aggregate = {
  __typename?: 'company_leads_aggregate';
  aggregate?: Maybe<Company_Leads_Aggregate_Fields>;
  nodes: Array<Company_Leads>;
};

export type Company_Leads_Aggregate_Bool_Exp = {
  count?: InputMaybe<Company_Leads_Aggregate_Bool_Exp_Count>;
};

export type Company_Leads_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Company_Leads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Leads_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "company_leads" */
export type Company_Leads_Aggregate_Fields = {
  __typename?: 'company_leads_aggregate_fields';
  avg?: Maybe<Company_Leads_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Company_Leads_Max_Fields>;
  min?: Maybe<Company_Leads_Min_Fields>;
  stddev?: Maybe<Company_Leads_Stddev_Fields>;
  stddev_pop?: Maybe<Company_Leads_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Company_Leads_Stddev_Samp_Fields>;
  sum?: Maybe<Company_Leads_Sum_Fields>;
  var_pop?: Maybe<Company_Leads_Var_Pop_Fields>;
  var_samp?: Maybe<Company_Leads_Var_Samp_Fields>;
  variance?: Maybe<Company_Leads_Variance_Fields>;
};


/** aggregate fields of "company_leads" */
export type Company_Leads_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Leads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "company_leads" */
export type Company_Leads_Aggregate_Order_By = {
  avg?: InputMaybe<Company_Leads_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Company_Leads_Max_Order_By>;
  min?: InputMaybe<Company_Leads_Min_Order_By>;
  stddev?: InputMaybe<Company_Leads_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Company_Leads_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Company_Leads_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Company_Leads_Sum_Order_By>;
  var_pop?: InputMaybe<Company_Leads_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Company_Leads_Var_Samp_Order_By>;
  variance?: InputMaybe<Company_Leads_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "company_leads" */
export type Company_Leads_Arr_Rel_Insert_Input = {
  data: Array<Company_Leads_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Leads_On_Conflict>;
};

/** aggregate avg on columns */
export type Company_Leads_Avg_Fields = {
  __typename?: 'company_leads_avg_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "company_leads" */
export type Company_Leads_Avg_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "company_leads". All fields are combined with a logical 'AND'. */
export type Company_Leads_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Leads_Bool_Exp>>;
  _not?: InputMaybe<Company_Leads_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Leads_Bool_Exp>>;
  assigned_company_users?: InputMaybe<Bigint_Comparison_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  companyUserByConvertedCompanyUsers?: InputMaybe<Company_Users_Bool_Exp>;
  companyUserByCreatedByCompanyUsers?: InputMaybe<Company_Users_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  company_lead_tracks?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
  company_lead_tracks_aggregate?: InputMaybe<Company_Lead_Tracks_Aggregate_Bool_Exp>;
  company_user?: InputMaybe<Company_Users_Bool_Exp>;
  converted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  converted_company_users?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by_company_users?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  linked_user_users?: InputMaybe<Bigint_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
};

/** unique or primary key constraints on table "company_leads" */
export enum Company_Leads_Constraint {
  /** unique or primary key constraint on columns "id" */
  CompanyLeadsPkey = 'company_leads_pkey'
}

/** input type for incrementing numeric columns in table "company_leads" */
export type Company_Leads_Inc_Input = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "company_leads" */
export type Company_Leads_Insert_Input = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Scalars['bigint']['input']>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  companyUserByConvertedCompanyUsers?: InputMaybe<Company_Users_Obj_Rel_Insert_Input>;
  companyUserByCreatedByCompanyUsers?: InputMaybe<Company_Users_Obj_Rel_Insert_Input>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  company_lead_tracks?: InputMaybe<Company_Lead_Tracks_Arr_Rel_Insert_Input>;
  company_user?: InputMaybe<Company_Users_Obj_Rel_Insert_Input>;
  /** 线索转客户的时间 */
  converted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 线索身份-名字 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 线索身份-电话 */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** new / assigned / following / won / lost / converted */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Company_Leads_Max_Fields = {
  __typename?: 'company_leads_max_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['bigint']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 线索转客户的时间 */
  converted_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['bigint']['output']>;
  /** 线索身份-名字 */
  name?: Maybe<Scalars['String']['output']>;
  /** 线索身份-电话 */
  phone?: Maybe<Scalars['String']['output']>;
  /** new / assigned / following / won / lost / converted */
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "company_leads" */
export type Company_Leads_Max_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 线索转客户的时间 */
  converted_at?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
  /** 线索身份-名字 */
  name?: InputMaybe<Order_By>;
  /** 线索身份-电话 */
  phone?: InputMaybe<Order_By>;
  /** new / assigned / following / won / lost / converted */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Company_Leads_Min_Fields = {
  __typename?: 'company_leads_min_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['bigint']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 线索转客户的时间 */
  converted_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['bigint']['output']>;
  /** 线索身份-名字 */
  name?: Maybe<Scalars['String']['output']>;
  /** 线索身份-电话 */
  phone?: Maybe<Scalars['String']['output']>;
  /** new / assigned / following / won / lost / converted */
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "company_leads" */
export type Company_Leads_Min_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 线索转客户的时间 */
  converted_at?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
  /** 线索身份-名字 */
  name?: InputMaybe<Order_By>;
  /** 线索身份-电话 */
  phone?: InputMaybe<Order_By>;
  /** new / assigned / following / won / lost / converted */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "company_leads" */
export type Company_Leads_Mutation_Response = {
  __typename?: 'company_leads_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Company_Leads>;
};

/** input type for inserting object relation for remote table "company_leads" */
export type Company_Leads_Obj_Rel_Insert_Input = {
  data: Company_Leads_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Leads_On_Conflict>;
};

/** on_conflict condition type for table "company_leads" */
export type Company_Leads_On_Conflict = {
  constraint: Company_Leads_Constraint;
  update_columns?: Array<Company_Leads_Update_Column>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};

/** Ordering options when selecting data from "company_leads". */
export type Company_Leads_Order_By = {
  assigned_company_users?: InputMaybe<Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  companyUserByConvertedCompanyUsers?: InputMaybe<Company_Users_Order_By>;
  companyUserByCreatedByCompanyUsers?: InputMaybe<Company_Users_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  company_lead_tracks_aggregate?: InputMaybe<Company_Lead_Tracks_Aggregate_Order_By>;
  company_user?: InputMaybe<Company_Users_Order_By>;
  converted_at?: InputMaybe<Order_By>;
  converted_company_users?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  linked_user_users?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
};

/** primary key columns input for table: company_leads */
export type Company_Leads_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "company_leads" */
export enum Company_Leads_Select_Column {
  /** column name */
  AssignedCompanyUsers = 'assigned_company_users',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  ConvertedAt = 'converted_at',
  /** column name */
  ConvertedCompanyUsers = 'converted_company_users',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedByCompanyUsers = 'created_by_company_users',
  /** column name */
  Id = 'id',
  /** column name */
  LinkedUserUsers = 'linked_user_users',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "company_leads" */
export type Company_Leads_Set_Input = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 线索转客户的时间 */
  converted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 线索身份-名字 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 线索身份-电话 */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** new / assigned / following / won / lost / converted */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Company_Leads_Stddev_Fields = {
  __typename?: 'company_leads_stddev_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "company_leads" */
export type Company_Leads_Stddev_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Company_Leads_Stddev_Pop_Fields = {
  __typename?: 'company_leads_stddev_pop_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "company_leads" */
export type Company_Leads_Stddev_Pop_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Company_Leads_Stddev_Samp_Fields = {
  __typename?: 'company_leads_stddev_samp_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "company_leads" */
export type Company_Leads_Stddev_Samp_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "company_leads" */
export type Company_Leads_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Leads_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Leads_Stream_Cursor_Value_Input = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 线索转客户的时间 */
  converted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Scalars['bigint']['input']>;
  /** 线索身份-名字 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 线索身份-电话 */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** new / assigned / following / won / lost / converted */
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Company_Leads_Sum_Fields = {
  __typename?: 'company_leads_sum_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['bigint']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['bigint']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "company_leads" */
export type Company_Leads_Sum_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** update columns of table "company_leads" */
export enum Company_Leads_Update_Column {
  /** column name */
  AssignedCompanyUsers = 'assigned_company_users',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  ConvertedAt = 'converted_at',
  /** column name */
  ConvertedCompanyUsers = 'converted_company_users',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedByCompanyUsers = 'created_by_company_users',
  /** column name */
  Id = 'id',
  /** column name */
  LinkedUserUsers = 'linked_user_users',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Company_Leads_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Company_Leads_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Leads_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Leads_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Company_Leads_Var_Pop_Fields = {
  __typename?: 'company_leads_var_pop_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "company_leads" */
export type Company_Leads_Var_Pop_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Company_Leads_Var_Samp_Fields = {
  __typename?: 'company_leads_var_samp_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "company_leads" */
export type Company_Leads_Var_Samp_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Company_Leads_Variance_Fields = {
  __typename?: 'company_leads_variance_fields';
  /** 外键，谁跟进 */
  assigned_company_users?: Maybe<Scalars['Float']['output']>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: Maybe<Scalars['Float']['output']>;
  /** 谁录入 */
  created_by_company_users?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "company_leads" */
export type Company_Leads_Variance_Order_By = {
  /** 外键，谁跟进 */
  assigned_company_users?: InputMaybe<Order_By>;
  /** 关联外建，哪个公司的线索 */
  company_companies?: InputMaybe<Order_By>;
  /** 成功后指向新产生的公司客户记录；与 status = converted 一致 */
  converted_company_users?: InputMaybe<Order_By>;
  /** 谁录入 */
  created_by_company_users?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 若线索手机号已注册平台用户 */
  linked_user_users?: InputMaybe<Order_By>;
};

/** 公司的套餐关联表 */
export type Company_Packages = {
  __typename?: 'company_packages';
  /** An object relationship */
  company: Companies;
  /** 关联公司 */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  package: Packages;
  /** 关联套餐 */
  package_packages: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "company_packages" */
export type Company_Packages_Aggregate = {
  __typename?: 'company_packages_aggregate';
  aggregate?: Maybe<Company_Packages_Aggregate_Fields>;
  nodes: Array<Company_Packages>;
};

export type Company_Packages_Aggregate_Bool_Exp = {
  count?: InputMaybe<Company_Packages_Aggregate_Bool_Exp_Count>;
};

export type Company_Packages_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Company_Packages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Packages_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "company_packages" */
export type Company_Packages_Aggregate_Fields = {
  __typename?: 'company_packages_aggregate_fields';
  avg?: Maybe<Company_Packages_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Company_Packages_Max_Fields>;
  min?: Maybe<Company_Packages_Min_Fields>;
  stddev?: Maybe<Company_Packages_Stddev_Fields>;
  stddev_pop?: Maybe<Company_Packages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Company_Packages_Stddev_Samp_Fields>;
  sum?: Maybe<Company_Packages_Sum_Fields>;
  var_pop?: Maybe<Company_Packages_Var_Pop_Fields>;
  var_samp?: Maybe<Company_Packages_Var_Samp_Fields>;
  variance?: Maybe<Company_Packages_Variance_Fields>;
};


/** aggregate fields of "company_packages" */
export type Company_Packages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Packages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "company_packages" */
export type Company_Packages_Aggregate_Order_By = {
  avg?: InputMaybe<Company_Packages_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Company_Packages_Max_Order_By>;
  min?: InputMaybe<Company_Packages_Min_Order_By>;
  stddev?: InputMaybe<Company_Packages_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Company_Packages_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Company_Packages_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Company_Packages_Sum_Order_By>;
  var_pop?: InputMaybe<Company_Packages_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Company_Packages_Var_Samp_Order_By>;
  variance?: InputMaybe<Company_Packages_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "company_packages" */
export type Company_Packages_Arr_Rel_Insert_Input = {
  data: Array<Company_Packages_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Packages_On_Conflict>;
};

/** aggregate avg on columns */
export type Company_Packages_Avg_Fields = {
  __typename?: 'company_packages_avg_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "company_packages" */
export type Company_Packages_Avg_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "company_packages". All fields are combined with a logical 'AND'. */
export type Company_Packages_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Packages_Bool_Exp>>;
  _not?: InputMaybe<Company_Packages_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Packages_Bool_Exp>>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  package?: InputMaybe<Packages_Bool_Exp>;
  package_packages?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  wx_scan_code?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "company_packages" */
export enum Company_Packages_Constraint {
  /** unique or primary key constraint on columns "company_companies", "package_packages" */
  CompanyPackagesCompanyCompaniesPackagePackagesKey = 'company_packages_company_companies_package_packages_key',
  /** unique or primary key constraint on columns "id" */
  CompanyPackagesPkey = 'company_packages_pkey'
}

/** input type for incrementing numeric columns in table "company_packages" */
export type Company_Packages_Inc_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "company_packages" */
export type Company_Packages_Insert_Input = {
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  package?: InputMaybe<Packages_Obj_Rel_Insert_Input>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Company_Packages_Max_Fields = {
  __typename?: 'company_packages_max_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "company_packages" */
export type Company_Packages_Max_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Company_Packages_Min_Fields = {
  __typename?: 'company_packages_min_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "company_packages" */
export type Company_Packages_Min_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "company_packages" */
export type Company_Packages_Mutation_Response = {
  __typename?: 'company_packages_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Company_Packages>;
};

/** on_conflict condition type for table "company_packages" */
export type Company_Packages_On_Conflict = {
  constraint: Company_Packages_Constraint;
  update_columns?: Array<Company_Packages_Update_Column>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};

/** Ordering options when selecting data from "company_packages". */
export type Company_Packages_Order_By = {
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  package?: InputMaybe<Packages_Order_By>;
  package_packages?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  wx_scan_code?: InputMaybe<Order_By>;
};

/** primary key columns input for table: company_packages */
export type Company_Packages_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "company_packages" */
export enum Company_Packages_Select_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PackagePackages = 'package_packages',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

/** input type for updating data in table "company_packages" */
export type Company_Packages_Set_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Company_Packages_Stddev_Fields = {
  __typename?: 'company_packages_stddev_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "company_packages" */
export type Company_Packages_Stddev_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Company_Packages_Stddev_Pop_Fields = {
  __typename?: 'company_packages_stddev_pop_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "company_packages" */
export type Company_Packages_Stddev_Pop_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Company_Packages_Stddev_Samp_Fields = {
  __typename?: 'company_packages_stddev_samp_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "company_packages" */
export type Company_Packages_Stddev_Samp_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "company_packages" */
export type Company_Packages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Packages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Packages_Stream_Cursor_Value_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Company_Packages_Sum_Fields = {
  __typename?: 'company_packages_sum_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "company_packages" */
export type Company_Packages_Sum_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** update columns of table "company_packages" */
export enum Company_Packages_Update_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PackagePackages = 'package_packages',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

export type Company_Packages_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Company_Packages_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Packages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Packages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Company_Packages_Var_Pop_Fields = {
  __typename?: 'company_packages_var_pop_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "company_packages" */
export type Company_Packages_Var_Pop_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Company_Packages_Var_Samp_Fields = {
  __typename?: 'company_packages_var_samp_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "company_packages" */
export type Company_Packages_Var_Samp_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Company_Packages_Variance_Fields = {
  __typename?: 'company_packages_variance_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联套餐 */
  package_packages?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "company_packages" */
export type Company_Packages_Variance_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联套餐 */
  package_packages?: InputMaybe<Order_By>;
};

/** 公司下的产品关联表 */
export type Company_Products = {
  __typename?: 'company_products';
  /** An object relationship */
  company: Companies;
  /** 关联公司 */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  product: Products;
  /** 关联产品 */
  product_products: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "company_products" */
export type Company_Products_Aggregate = {
  __typename?: 'company_products_aggregate';
  aggregate?: Maybe<Company_Products_Aggregate_Fields>;
  nodes: Array<Company_Products>;
};

export type Company_Products_Aggregate_Bool_Exp = {
  count?: InputMaybe<Company_Products_Aggregate_Bool_Exp_Count>;
};

export type Company_Products_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Company_Products_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Products_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "company_products" */
export type Company_Products_Aggregate_Fields = {
  __typename?: 'company_products_aggregate_fields';
  avg?: Maybe<Company_Products_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Company_Products_Max_Fields>;
  min?: Maybe<Company_Products_Min_Fields>;
  stddev?: Maybe<Company_Products_Stddev_Fields>;
  stddev_pop?: Maybe<Company_Products_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Company_Products_Stddev_Samp_Fields>;
  sum?: Maybe<Company_Products_Sum_Fields>;
  var_pop?: Maybe<Company_Products_Var_Pop_Fields>;
  var_samp?: Maybe<Company_Products_Var_Samp_Fields>;
  variance?: Maybe<Company_Products_Variance_Fields>;
};


/** aggregate fields of "company_products" */
export type Company_Products_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Products_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "company_products" */
export type Company_Products_Aggregate_Order_By = {
  avg?: InputMaybe<Company_Products_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Company_Products_Max_Order_By>;
  min?: InputMaybe<Company_Products_Min_Order_By>;
  stddev?: InputMaybe<Company_Products_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Company_Products_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Company_Products_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Company_Products_Sum_Order_By>;
  var_pop?: InputMaybe<Company_Products_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Company_Products_Var_Samp_Order_By>;
  variance?: InputMaybe<Company_Products_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "company_products" */
export type Company_Products_Arr_Rel_Insert_Input = {
  data: Array<Company_Products_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Products_On_Conflict>;
};

/** aggregate avg on columns */
export type Company_Products_Avg_Fields = {
  __typename?: 'company_products_avg_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "company_products" */
export type Company_Products_Avg_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "company_products". All fields are combined with a logical 'AND'. */
export type Company_Products_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Products_Bool_Exp>>;
  _not?: InputMaybe<Company_Products_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Products_Bool_Exp>>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  product?: InputMaybe<Products_Bool_Exp>;
  product_products?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  wx_scan_code?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "company_products" */
export enum Company_Products_Constraint {
  /** unique or primary key constraint on columns "company_companies", "product_products" */
  CompanyProductsCompanyCompaniesProductProductsKey = 'company_products_company_companies_product_products_key',
  /** unique or primary key constraint on columns "id" */
  CompanyProductsPkey = 'company_products_pkey'
}

/** input type for incrementing numeric columns in table "company_products" */
export type Company_Products_Inc_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联产品 */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "company_products" */
export type Company_Products_Insert_Input = {
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  product?: InputMaybe<Products_Obj_Rel_Insert_Input>;
  /** 关联产品 */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Company_Products_Max_Fields = {
  __typename?: 'company_products_max_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "company_products" */
export type Company_Products_Max_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Company_Products_Min_Fields = {
  __typename?: 'company_products_min_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 微信小程序二维码 */
  wx_scan_code?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "company_products" */
export type Company_Products_Min_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "company_products" */
export type Company_Products_Mutation_Response = {
  __typename?: 'company_products_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Company_Products>;
};

/** on_conflict condition type for table "company_products" */
export type Company_Products_On_Conflict = {
  constraint: Company_Products_Constraint;
  update_columns?: Array<Company_Products_Update_Column>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};

/** Ordering options when selecting data from "company_products". */
export type Company_Products_Order_By = {
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  product?: InputMaybe<Products_Order_By>;
  product_products?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  wx_scan_code?: InputMaybe<Order_By>;
};

/** primary key columns input for table: company_products */
export type Company_Products_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "company_products" */
export enum Company_Products_Select_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProductProducts = 'product_products',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

/** input type for updating data in table "company_products" */
export type Company_Products_Set_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联产品 */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Company_Products_Stddev_Fields = {
  __typename?: 'company_products_stddev_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "company_products" */
export type Company_Products_Stddev_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Company_Products_Stddev_Pop_Fields = {
  __typename?: 'company_products_stddev_pop_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "company_products" */
export type Company_Products_Stddev_Pop_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Company_Products_Stddev_Samp_Fields = {
  __typename?: 'company_products_stddev_samp_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "company_products" */
export type Company_Products_Stddev_Samp_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "company_products" */
export type Company_Products_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Products_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Products_Stream_Cursor_Value_Input = {
  /** 关联公司 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 关联产品 */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 微信小程序二维码 */
  wx_scan_code?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Company_Products_Sum_Fields = {
  __typename?: 'company_products_sum_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "company_products" */
export type Company_Products_Sum_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** update columns of table "company_products" */
export enum Company_Products_Update_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProductProducts = 'product_products',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxScanCode = 'wx_scan_code'
}

export type Company_Products_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Company_Products_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Products_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Products_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Company_Products_Var_Pop_Fields = {
  __typename?: 'company_products_var_pop_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "company_products" */
export type Company_Products_Var_Pop_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Company_Products_Var_Samp_Fields = {
  __typename?: 'company_products_var_samp_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "company_products" */
export type Company_Products_Var_Samp_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Company_Products_Variance_Fields = {
  __typename?: 'company_products_variance_fields';
  /** 关联公司 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 关联产品 */
  product_products?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "company_products" */
export type Company_Products_Variance_Order_By = {
  /** 关联公司 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 关联产品 */
  product_products?: InputMaybe<Order_By>;
};

/** 公司用户 */
export type Company_Users = {
  __typename?: 'company_users';
  /** 用户能否看到本公司的价格，默认是不能看到的，需要联系公司管理员进行授权后可见 */
  can_view_price: Scalars['Boolean']['output'];
  /** An object relationship */
  company: Companies;
  /** An array relationship */
  companyLeadsByConvertedCompanyUsers: Array<Company_Leads>;
  /** An aggregate relationship */
  companyLeadsByConvertedCompanyUsers_aggregate: Company_Leads_Aggregate;
  /** An array relationship */
  companyLeadsByCreatedByCompanyUsers: Array<Company_Leads>;
  /** An aggregate relationship */
  companyLeadsByCreatedByCompanyUsers_aggregate: Company_Leads_Aggregate;
  /** 公司id */
  company_companies: Scalars['bigint']['output'];
  /** An array relationship */
  company_lead_tracks: Array<Company_Lead_Tracks>;
  /** An aggregate relationship */
  company_lead_tracks_aggregate: Company_Lead_Tracks_Aggregate;
  /** An array relationship */
  company_leads: Array<Company_Leads>;
  /** An aggregate relationship */
  company_leads_aggregate: Company_Leads_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level: Scalars['String']['output'];
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: Maybe<Scalars['String']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor: Scalars['numeric']['output'];
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  /** 用户id */
  user_users: Scalars['bigint']['output'];
};


/** 公司用户 */
export type Company_UsersCompanyLeadsByConvertedCompanyUsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompanyLeadsByConvertedCompanyUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompanyLeadsByCreatedByCompanyUsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompanyLeadsByCreatedByCompanyUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompany_Lead_TracksArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompany_Lead_Tracks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompany_LeadsArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 公司用户 */
export type Company_UsersCompany_Leads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};

/** aggregated selection of "company_users" */
export type Company_Users_Aggregate = {
  __typename?: 'company_users_aggregate';
  aggregate?: Maybe<Company_Users_Aggregate_Fields>;
  nodes: Array<Company_Users>;
};

export type Company_Users_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Company_Users_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Company_Users_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Company_Users_Aggregate_Bool_Exp_Count>;
};

export type Company_Users_Aggregate_Bool_Exp_Bool_And = {
  arguments: Company_Users_Select_Column_Company_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Company_Users_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Company_Users_Select_Column_Company_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Company_Users_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Company_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Company_Users_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "company_users" */
export type Company_Users_Aggregate_Fields = {
  __typename?: 'company_users_aggregate_fields';
  avg?: Maybe<Company_Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Company_Users_Max_Fields>;
  min?: Maybe<Company_Users_Min_Fields>;
  stddev?: Maybe<Company_Users_Stddev_Fields>;
  stddev_pop?: Maybe<Company_Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Company_Users_Stddev_Samp_Fields>;
  sum?: Maybe<Company_Users_Sum_Fields>;
  var_pop?: Maybe<Company_Users_Var_Pop_Fields>;
  var_samp?: Maybe<Company_Users_Var_Samp_Fields>;
  variance?: Maybe<Company_Users_Variance_Fields>;
};


/** aggregate fields of "company_users" */
export type Company_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "company_users" */
export type Company_Users_Aggregate_Order_By = {
  avg?: InputMaybe<Company_Users_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Company_Users_Max_Order_By>;
  min?: InputMaybe<Company_Users_Min_Order_By>;
  stddev?: InputMaybe<Company_Users_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Company_Users_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Company_Users_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Company_Users_Sum_Order_By>;
  var_pop?: InputMaybe<Company_Users_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Company_Users_Var_Samp_Order_By>;
  variance?: InputMaybe<Company_Users_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "company_users" */
export type Company_Users_Arr_Rel_Insert_Input = {
  data: Array<Company_Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Users_On_Conflict>;
};

/** aggregate avg on columns */
export type Company_Users_Avg_Fields = {
  __typename?: 'company_users_avg_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "company_users" */
export type Company_Users_Avg_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "company_users". All fields are combined with a logical 'AND'. */
export type Company_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Users_Bool_Exp>>;
  _not?: InputMaybe<Company_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Users_Bool_Exp>>;
  can_view_price?: InputMaybe<Boolean_Comparison_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  companyLeadsByConvertedCompanyUsers?: InputMaybe<Company_Leads_Bool_Exp>;
  companyLeadsByConvertedCompanyUsers_aggregate?: InputMaybe<Company_Leads_Aggregate_Bool_Exp>;
  companyLeadsByCreatedByCompanyUsers?: InputMaybe<Company_Leads_Bool_Exp>;
  companyLeadsByCreatedByCompanyUsers_aggregate?: InputMaybe<Company_Leads_Aggregate_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  company_lead_tracks?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
  company_lead_tracks_aggregate?: InputMaybe<Company_Lead_Tracks_Aggregate_Bool_Exp>;
  company_leads?: InputMaybe<Company_Leads_Bool_Exp>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  level?: InputMaybe<String_Comparison_Exp>;
  permissions?: InputMaybe<String_Comparison_Exp>;
  price_factor?: InputMaybe<Numeric_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_users?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "company_users" */
export enum Company_Users_Constraint {
  /** unique or primary key constraint on columns "user_users", "company_companies" */
  CompanyUsersCompanyCompaniesUserUsersKey = 'company_users_company_companies_user_users_key',
  /** unique or primary key constraint on columns "id" */
  CompanyUsersPkey = 'company_users_pkey'
}

/** input type for incrementing numeric columns in table "company_users" */
export type Company_Users_Inc_Input = {
  /** 公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "company_users" */
export type Company_Users_Insert_Input = {
  /** 用户能否看到本公司的价格，默认是不能看到的，需要联系公司管理员进行授权后可见 */
  can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  companyLeadsByConvertedCompanyUsers?: InputMaybe<Company_Leads_Arr_Rel_Insert_Input>;
  companyLeadsByCreatedByCompanyUsers?: InputMaybe<Company_Leads_Arr_Rel_Insert_Input>;
  /** 公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  company_lead_tracks?: InputMaybe<Company_Lead_Tracks_Arr_Rel_Insert_Input>;
  company_leads?: InputMaybe<Company_Leads_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: InputMaybe<Scalars['String']['input']>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: InputMaybe<Scalars['String']['input']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Company_Users_Max_Fields = {
  __typename?: 'company_users_max_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: Maybe<Scalars['String']['output']>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: Maybe<Scalars['String']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "company_users" */
export type Company_Users_Max_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: InputMaybe<Order_By>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Company_Users_Min_Fields = {
  __typename?: 'company_users_min_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: Maybe<Scalars['String']['output']>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: Maybe<Scalars['String']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "company_users" */
export type Company_Users_Min_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: InputMaybe<Order_By>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "company_users" */
export type Company_Users_Mutation_Response = {
  __typename?: 'company_users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Company_Users>;
};

/** input type for inserting object relation for remote table "company_users" */
export type Company_Users_Obj_Rel_Insert_Input = {
  data: Company_Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_Users_On_Conflict>;
};

/** on_conflict condition type for table "company_users" */
export type Company_Users_On_Conflict = {
  constraint: Company_Users_Constraint;
  update_columns?: Array<Company_Users_Update_Column>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "company_users". */
export type Company_Users_Order_By = {
  can_view_price?: InputMaybe<Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  companyLeadsByConvertedCompanyUsers_aggregate?: InputMaybe<Company_Leads_Aggregate_Order_By>;
  companyLeadsByCreatedByCompanyUsers_aggregate?: InputMaybe<Company_Leads_Aggregate_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  company_lead_tracks_aggregate?: InputMaybe<Company_Lead_Tracks_Aggregate_Order_By>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  permissions?: InputMaybe<Order_By>;
  price_factor?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** primary key columns input for table: company_users */
export type Company_Users_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "company_users" */
export enum Company_Users_Select_Column {
  /** column name */
  CanViewPrice = 'can_view_price',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Permissions = 'permissions',
  /** column name */
  PriceFactor = 'price_factor',
  /** column name */
  Role = 'role',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

/** select "company_users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "company_users" */
export enum Company_Users_Select_Column_Company_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  CanViewPrice = 'can_view_price'
}

/** select "company_users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "company_users" */
export enum Company_Users_Select_Column_Company_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  CanViewPrice = 'can_view_price'
}

/** input type for updating data in table "company_users" */
export type Company_Users_Set_Input = {
  /** 用户能否看到本公司的价格，默认是不能看到的，需要联系公司管理员进行授权后可见 */
  can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  /** 公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: InputMaybe<Scalars['String']['input']>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: InputMaybe<Scalars['String']['input']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Company_Users_Stddev_Fields = {
  __typename?: 'company_users_stddev_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "company_users" */
export type Company_Users_Stddev_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Company_Users_Stddev_Pop_Fields = {
  __typename?: 'company_users_stddev_pop_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "company_users" */
export type Company_Users_Stddev_Pop_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Company_Users_Stddev_Samp_Fields = {
  __typename?: 'company_users_stddev_samp_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "company_users" */
export type Company_Users_Stddev_Samp_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "company_users" */
export type Company_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Users_Stream_Cursor_Value_Input = {
  /** 用户能否看到本公司的价格，默认是不能看到的，需要联系公司管理员进行授权后可见 */
  can_view_price?: InputMaybe<Scalars['Boolean']['input']>;
  /** 公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 客户等级划分 1.A 2.B 3.C 4.D 5.E */
  level?: InputMaybe<Scalars['String']['input']>;
  /** 用户权限 1.admin_lead（管理线索） 2. track_lead（跟进线索） 可以有多个,多个用&连接，如：admin_lead&track_lead */
  permissions?: InputMaybe<Scalars['String']['input']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 用户在公司下的角色： 1.admin（可以管理公司的分类、公司的产品及套餐、授权公司用户）、2.user（普通用户） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 用户id */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Company_Users_Sum_Fields = {
  __typename?: 'company_users_sum_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "company_users" */
export type Company_Users_Sum_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** update columns of table "company_users" */
export enum Company_Users_Update_Column {
  /** column name */
  CanViewPrice = 'can_view_price',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Permissions = 'permissions',
  /** column name */
  PriceFactor = 'price_factor',
  /** column name */
  Role = 'role',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

export type Company_Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Company_Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Company_Users_Var_Pop_Fields = {
  __typename?: 'company_users_var_pop_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "company_users" */
export type Company_Users_Var_Pop_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Company_Users_Var_Samp_Fields = {
  __typename?: 'company_users_var_samp_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "company_users" */
export type Company_Users_Var_Samp_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Company_Users_Variance_Fields = {
  __typename?: 'company_users_variance_fields';
  /** 公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 用户id */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "company_users" */
export type Company_Users_Variance_Order_By = {
  /** 公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 该用户在公司下看到的价格系数（大于0数值），默认为1表示和产品价格一致 */
  price_factor?: InputMaybe<Order_By>;
  /** 用户id */
  user_users?: InputMaybe<Order_By>;
};

/** 配置表 */
export type Configs = {
  __typename?: 'configs';
  created_at: Scalars['timestamptz']['output'];
  /** 描述 */
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  /** 是否可删除的配置 */
  is_deletable: Scalars['Boolean']['output'];
  /** 配置名 */
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** 配置值（json数据，type=string｜number｜array｜json、type为json或者array的时候content键存放对应的值） */
  value?: Maybe<Scalars['json']['output']>;
};


/** 配置表 */
export type ConfigsValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "configs" */
export type Configs_Aggregate = {
  __typename?: 'configs_aggregate';
  aggregate?: Maybe<Configs_Aggregate_Fields>;
  nodes: Array<Configs>;
};

/** aggregate fields of "configs" */
export type Configs_Aggregate_Fields = {
  __typename?: 'configs_aggregate_fields';
  avg?: Maybe<Configs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Configs_Max_Fields>;
  min?: Maybe<Configs_Min_Fields>;
  stddev?: Maybe<Configs_Stddev_Fields>;
  stddev_pop?: Maybe<Configs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Configs_Stddev_Samp_Fields>;
  sum?: Maybe<Configs_Sum_Fields>;
  var_pop?: Maybe<Configs_Var_Pop_Fields>;
  var_samp?: Maybe<Configs_Var_Samp_Fields>;
  variance?: Maybe<Configs_Variance_Fields>;
};


/** aggregate fields of "configs" */
export type Configs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Configs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Configs_Avg_Fields = {
  __typename?: 'configs_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "configs". All fields are combined with a logical 'AND'. */
export type Configs_Bool_Exp = {
  _and?: InputMaybe<Array<Configs_Bool_Exp>>;
  _not?: InputMaybe<Configs_Bool_Exp>;
  _or?: InputMaybe<Array<Configs_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_deletable?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  value?: InputMaybe<Json_Comparison_Exp>;
};

/** unique or primary key constraints on table "configs" */
export enum Configs_Constraint {
  /** unique or primary key constraint on columns "name" */
  ConfigsNameKey = 'configs_name_key',
  /** unique or primary key constraint on columns "id" */
  ConfigsPkey = 'configs_pkey'
}

/** input type for incrementing numeric columns in table "configs" */
export type Configs_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "configs" */
export type Configs_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 描述 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否可删除的配置 */
  is_deletable?: InputMaybe<Scalars['Boolean']['input']>;
  /** 配置名 */
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 配置值（json数据，type=string｜number｜array｜json、type为json或者array的时候content键存放对应的值） */
  value?: InputMaybe<Scalars['json']['input']>;
};

/** aggregate max on columns */
export type Configs_Max_Fields = {
  __typename?: 'configs_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 描述 */
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 配置名 */
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Configs_Min_Fields = {
  __typename?: 'configs_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 描述 */
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 配置名 */
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "configs" */
export type Configs_Mutation_Response = {
  __typename?: 'configs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Configs>;
};

/** on_conflict condition type for table "configs" */
export type Configs_On_Conflict = {
  constraint: Configs_Constraint;
  update_columns?: Array<Configs_Update_Column>;
  where?: InputMaybe<Configs_Bool_Exp>;
};

/** Ordering options when selecting data from "configs". */
export type Configs_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deletable?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: configs */
export type Configs_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "configs" */
export enum Configs_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeletable = 'is_deletable',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "configs" */
export type Configs_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 描述 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否可删除的配置 */
  is_deletable?: InputMaybe<Scalars['Boolean']['input']>;
  /** 配置名 */
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 配置值（json数据，type=string｜number｜array｜json、type为json或者array的时候content键存放对应的值） */
  value?: InputMaybe<Scalars['json']['input']>;
};

/** aggregate stddev on columns */
export type Configs_Stddev_Fields = {
  __typename?: 'configs_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Configs_Stddev_Pop_Fields = {
  __typename?: 'configs_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Configs_Stddev_Samp_Fields = {
  __typename?: 'configs_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "configs" */
export type Configs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Configs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Configs_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 描述 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否可删除的配置 */
  is_deletable?: InputMaybe<Scalars['Boolean']['input']>;
  /** 配置名 */
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 配置值（json数据，type=string｜number｜array｜json、type为json或者array的时候content键存放对应的值） */
  value?: InputMaybe<Scalars['json']['input']>;
};

/** aggregate sum on columns */
export type Configs_Sum_Fields = {
  __typename?: 'configs_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "configs" */
export enum Configs_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeletable = 'is_deletable',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

export type Configs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Configs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Configs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Configs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Configs_Var_Pop_Fields = {
  __typename?: 'configs_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Configs_Var_Samp_Fields = {
  __typename?: 'configs_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Configs_Variance_Fields = {
  __typename?: 'configs_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['json']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['json']['input']>>;
  _eq?: InputMaybe<Array<Scalars['json']['input']>>;
  _gt?: InputMaybe<Array<Scalars['json']['input']>>;
  _gte?: InputMaybe<Array<Scalars['json']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['json']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['json']['input']>>;
  _lte?: InputMaybe<Array<Scalars['json']['input']>>;
  _neq?: InputMaybe<Array<Scalars['json']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['json']['input']>>>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "addresses" */
  delete_addresses?: Maybe<Addresses_Mutation_Response>;
  /** delete single row from the table: "addresses" */
  delete_addresses_by_pk?: Maybe<Addresses>;
  /** delete data from the table: "carts" */
  delete_carts?: Maybe<Carts_Mutation_Response>;
  /** delete single row from the table: "carts" */
  delete_carts_by_pk?: Maybe<Carts>;
  /** delete data from the table: "categories" */
  delete_categories?: Maybe<Categories_Mutation_Response>;
  /** delete single row from the table: "categories" */
  delete_categories_by_pk?: Maybe<Categories>;
  /** delete data from the table: "companies" */
  delete_companies?: Maybe<Companies_Mutation_Response>;
  /** delete single row from the table: "companies" */
  delete_companies_by_pk?: Maybe<Companies>;
  /** delete data from the table: "company_lead_tracks" */
  delete_company_lead_tracks?: Maybe<Company_Lead_Tracks_Mutation_Response>;
  /** delete single row from the table: "company_lead_tracks" */
  delete_company_lead_tracks_by_pk?: Maybe<Company_Lead_Tracks>;
  /** delete data from the table: "company_leads" */
  delete_company_leads?: Maybe<Company_Leads_Mutation_Response>;
  /** delete single row from the table: "company_leads" */
  delete_company_leads_by_pk?: Maybe<Company_Leads>;
  /** delete data from the table: "company_packages" */
  delete_company_packages?: Maybe<Company_Packages_Mutation_Response>;
  /** delete single row from the table: "company_packages" */
  delete_company_packages_by_pk?: Maybe<Company_Packages>;
  /** delete data from the table: "company_products" */
  delete_company_products?: Maybe<Company_Products_Mutation_Response>;
  /** delete single row from the table: "company_products" */
  delete_company_products_by_pk?: Maybe<Company_Products>;
  /** delete data from the table: "company_users" */
  delete_company_users?: Maybe<Company_Users_Mutation_Response>;
  /** delete single row from the table: "company_users" */
  delete_company_users_by_pk?: Maybe<Company_Users>;
  /** delete data from the table: "configs" */
  delete_configs?: Maybe<Configs_Mutation_Response>;
  /** delete single row from the table: "configs" */
  delete_configs_by_pk?: Maybe<Configs>;
  /** delete data from the table: "order_items" */
  delete_order_items?: Maybe<Order_Items_Mutation_Response>;
  /** delete single row from the table: "order_items" */
  delete_order_items_by_pk?: Maybe<Order_Items>;
  /** delete data from the table: "orders" */
  delete_orders?: Maybe<Orders_Mutation_Response>;
  /** delete single row from the table: "orders" */
  delete_orders_by_pk?: Maybe<Orders>;
  /** delete data from the table: "package_product_skus" */
  delete_package_product_skus?: Maybe<Package_Product_Skus_Mutation_Response>;
  /** delete single row from the table: "package_product_skus" */
  delete_package_product_skus_by_pk?: Maybe<Package_Product_Skus>;
  /** delete data from the table: "packages" */
  delete_packages?: Maybe<Packages_Mutation_Response>;
  /** delete single row from the table: "packages" */
  delete_packages_by_pk?: Maybe<Packages>;
  /** delete data from the table: "product_skus" */
  delete_product_skus?: Maybe<Product_Skus_Mutation_Response>;
  /** delete single row from the table: "product_skus" */
  delete_product_skus_by_pk?: Maybe<Product_Skus>;
  /** delete data from the table: "products" */
  delete_products?: Maybe<Products_Mutation_Response>;
  /** delete single row from the table: "products" */
  delete_products_by_pk?: Maybe<Products>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "addresses" */
  insert_addresses?: Maybe<Addresses_Mutation_Response>;
  /** insert a single row into the table: "addresses" */
  insert_addresses_one?: Maybe<Addresses>;
  /** insert data into the table: "carts" */
  insert_carts?: Maybe<Carts_Mutation_Response>;
  /** insert a single row into the table: "carts" */
  insert_carts_one?: Maybe<Carts>;
  /** insert data into the table: "categories" */
  insert_categories?: Maybe<Categories_Mutation_Response>;
  /** insert a single row into the table: "categories" */
  insert_categories_one?: Maybe<Categories>;
  /** insert data into the table: "companies" */
  insert_companies?: Maybe<Companies_Mutation_Response>;
  /** insert a single row into the table: "companies" */
  insert_companies_one?: Maybe<Companies>;
  /** insert data into the table: "company_lead_tracks" */
  insert_company_lead_tracks?: Maybe<Company_Lead_Tracks_Mutation_Response>;
  /** insert a single row into the table: "company_lead_tracks" */
  insert_company_lead_tracks_one?: Maybe<Company_Lead_Tracks>;
  /** insert data into the table: "company_leads" */
  insert_company_leads?: Maybe<Company_Leads_Mutation_Response>;
  /** insert a single row into the table: "company_leads" */
  insert_company_leads_one?: Maybe<Company_Leads>;
  /** insert data into the table: "company_packages" */
  insert_company_packages?: Maybe<Company_Packages_Mutation_Response>;
  /** insert a single row into the table: "company_packages" */
  insert_company_packages_one?: Maybe<Company_Packages>;
  /** insert data into the table: "company_products" */
  insert_company_products?: Maybe<Company_Products_Mutation_Response>;
  /** insert a single row into the table: "company_products" */
  insert_company_products_one?: Maybe<Company_Products>;
  /** insert data into the table: "company_users" */
  insert_company_users?: Maybe<Company_Users_Mutation_Response>;
  /** insert a single row into the table: "company_users" */
  insert_company_users_one?: Maybe<Company_Users>;
  /** insert data into the table: "configs" */
  insert_configs?: Maybe<Configs_Mutation_Response>;
  /** insert a single row into the table: "configs" */
  insert_configs_one?: Maybe<Configs>;
  /** insert data into the table: "order_items" */
  insert_order_items?: Maybe<Order_Items_Mutation_Response>;
  /** insert a single row into the table: "order_items" */
  insert_order_items_one?: Maybe<Order_Items>;
  /** insert data into the table: "orders" */
  insert_orders?: Maybe<Orders_Mutation_Response>;
  /** insert a single row into the table: "orders" */
  insert_orders_one?: Maybe<Orders>;
  /** insert data into the table: "package_product_skus" */
  insert_package_product_skus?: Maybe<Package_Product_Skus_Mutation_Response>;
  /** insert a single row into the table: "package_product_skus" */
  insert_package_product_skus_one?: Maybe<Package_Product_Skus>;
  /** insert data into the table: "packages" */
  insert_packages?: Maybe<Packages_Mutation_Response>;
  /** insert a single row into the table: "packages" */
  insert_packages_one?: Maybe<Packages>;
  /** insert data into the table: "product_skus" */
  insert_product_skus?: Maybe<Product_Skus_Mutation_Response>;
  /** insert a single row into the table: "product_skus" */
  insert_product_skus_one?: Maybe<Product_Skus>;
  /** insert data into the table: "products" */
  insert_products?: Maybe<Products_Mutation_Response>;
  /** insert a single row into the table: "products" */
  insert_products_one?: Maybe<Products>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "addresses" */
  update_addresses?: Maybe<Addresses_Mutation_Response>;
  /** update single row of the table: "addresses" */
  update_addresses_by_pk?: Maybe<Addresses>;
  /** update multiples rows of table: "addresses" */
  update_addresses_many?: Maybe<Array<Maybe<Addresses_Mutation_Response>>>;
  /** update data of the table: "carts" */
  update_carts?: Maybe<Carts_Mutation_Response>;
  /** update single row of the table: "carts" */
  update_carts_by_pk?: Maybe<Carts>;
  /** update multiples rows of table: "carts" */
  update_carts_many?: Maybe<Array<Maybe<Carts_Mutation_Response>>>;
  /** update data of the table: "categories" */
  update_categories?: Maybe<Categories_Mutation_Response>;
  /** update single row of the table: "categories" */
  update_categories_by_pk?: Maybe<Categories>;
  /** update multiples rows of table: "categories" */
  update_categories_many?: Maybe<Array<Maybe<Categories_Mutation_Response>>>;
  /** update data of the table: "companies" */
  update_companies?: Maybe<Companies_Mutation_Response>;
  /** update single row of the table: "companies" */
  update_companies_by_pk?: Maybe<Companies>;
  /** update multiples rows of table: "companies" */
  update_companies_many?: Maybe<Array<Maybe<Companies_Mutation_Response>>>;
  /** update data of the table: "company_lead_tracks" */
  update_company_lead_tracks?: Maybe<Company_Lead_Tracks_Mutation_Response>;
  /** update single row of the table: "company_lead_tracks" */
  update_company_lead_tracks_by_pk?: Maybe<Company_Lead_Tracks>;
  /** update multiples rows of table: "company_lead_tracks" */
  update_company_lead_tracks_many?: Maybe<Array<Maybe<Company_Lead_Tracks_Mutation_Response>>>;
  /** update data of the table: "company_leads" */
  update_company_leads?: Maybe<Company_Leads_Mutation_Response>;
  /** update single row of the table: "company_leads" */
  update_company_leads_by_pk?: Maybe<Company_Leads>;
  /** update multiples rows of table: "company_leads" */
  update_company_leads_many?: Maybe<Array<Maybe<Company_Leads_Mutation_Response>>>;
  /** update data of the table: "company_packages" */
  update_company_packages?: Maybe<Company_Packages_Mutation_Response>;
  /** update single row of the table: "company_packages" */
  update_company_packages_by_pk?: Maybe<Company_Packages>;
  /** update multiples rows of table: "company_packages" */
  update_company_packages_many?: Maybe<Array<Maybe<Company_Packages_Mutation_Response>>>;
  /** update data of the table: "company_products" */
  update_company_products?: Maybe<Company_Products_Mutation_Response>;
  /** update single row of the table: "company_products" */
  update_company_products_by_pk?: Maybe<Company_Products>;
  /** update multiples rows of table: "company_products" */
  update_company_products_many?: Maybe<Array<Maybe<Company_Products_Mutation_Response>>>;
  /** update data of the table: "company_users" */
  update_company_users?: Maybe<Company_Users_Mutation_Response>;
  /** update single row of the table: "company_users" */
  update_company_users_by_pk?: Maybe<Company_Users>;
  /** update multiples rows of table: "company_users" */
  update_company_users_many?: Maybe<Array<Maybe<Company_Users_Mutation_Response>>>;
  /** update data of the table: "configs" */
  update_configs?: Maybe<Configs_Mutation_Response>;
  /** update single row of the table: "configs" */
  update_configs_by_pk?: Maybe<Configs>;
  /** update multiples rows of table: "configs" */
  update_configs_many?: Maybe<Array<Maybe<Configs_Mutation_Response>>>;
  /** update data of the table: "order_items" */
  update_order_items?: Maybe<Order_Items_Mutation_Response>;
  /** update single row of the table: "order_items" */
  update_order_items_by_pk?: Maybe<Order_Items>;
  /** update multiples rows of table: "order_items" */
  update_order_items_many?: Maybe<Array<Maybe<Order_Items_Mutation_Response>>>;
  /** update data of the table: "orders" */
  update_orders?: Maybe<Orders_Mutation_Response>;
  /** update single row of the table: "orders" */
  update_orders_by_pk?: Maybe<Orders>;
  /** update multiples rows of table: "orders" */
  update_orders_many?: Maybe<Array<Maybe<Orders_Mutation_Response>>>;
  /** update data of the table: "package_product_skus" */
  update_package_product_skus?: Maybe<Package_Product_Skus_Mutation_Response>;
  /** update single row of the table: "package_product_skus" */
  update_package_product_skus_by_pk?: Maybe<Package_Product_Skus>;
  /** update multiples rows of table: "package_product_skus" */
  update_package_product_skus_many?: Maybe<Array<Maybe<Package_Product_Skus_Mutation_Response>>>;
  /** update data of the table: "packages" */
  update_packages?: Maybe<Packages_Mutation_Response>;
  /** update single row of the table: "packages" */
  update_packages_by_pk?: Maybe<Packages>;
  /** update multiples rows of table: "packages" */
  update_packages_many?: Maybe<Array<Maybe<Packages_Mutation_Response>>>;
  /** update data of the table: "product_skus" */
  update_product_skus?: Maybe<Product_Skus_Mutation_Response>;
  /** update single row of the table: "product_skus" */
  update_product_skus_by_pk?: Maybe<Product_Skus>;
  /** update multiples rows of table: "product_skus" */
  update_product_skus_many?: Maybe<Array<Maybe<Product_Skus_Mutation_Response>>>;
  /** update data of the table: "products" */
  update_products?: Maybe<Products_Mutation_Response>;
  /** update single row of the table: "products" */
  update_products_by_pk?: Maybe<Products>;
  /** update multiples rows of table: "products" */
  update_products_many?: Maybe<Array<Maybe<Products_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_AddressesArgs = {
  where: Addresses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Addresses_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CartsArgs = {
  where: Carts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Carts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CategoriesArgs = {
  where: Categories_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Categories_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CompaniesArgs = {
  where: Companies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Companies_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Company_Lead_TracksArgs = {
  where: Company_Lead_Tracks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Company_Lead_Tracks_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Company_LeadsArgs = {
  where: Company_Leads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Company_Leads_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Company_PackagesArgs = {
  where: Company_Packages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Company_Packages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Company_ProductsArgs = {
  where: Company_Products_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Company_Products_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Company_UsersArgs = {
  where: Company_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Company_Users_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ConfigsArgs = {
  where: Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Configs_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Order_ItemsArgs = {
  where: Order_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Order_Items_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_OrdersArgs = {
  where: Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Orders_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Package_Product_SkusArgs = {
  where: Package_Product_Skus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Package_Product_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_PackagesArgs = {
  where: Packages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Packages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Product_SkusArgs = {
  where: Product_Skus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Product_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ProductsArgs = {
  where: Products_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Products_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootInsert_AddressesArgs = {
  objects: Array<Addresses_Insert_Input>;
  on_conflict?: InputMaybe<Addresses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Addresses_OneArgs = {
  object: Addresses_Insert_Input;
  on_conflict?: InputMaybe<Addresses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CartsArgs = {
  objects: Array<Carts_Insert_Input>;
  on_conflict?: InputMaybe<Carts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Carts_OneArgs = {
  object: Carts_Insert_Input;
  on_conflict?: InputMaybe<Carts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CategoriesArgs = {
  objects: Array<Categories_Insert_Input>;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Categories_OneArgs = {
  object: Categories_Insert_Input;
  on_conflict?: InputMaybe<Categories_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CompaniesArgs = {
  objects: Array<Companies_Insert_Input>;
  on_conflict?: InputMaybe<Companies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Companies_OneArgs = {
  object: Companies_Insert_Input;
  on_conflict?: InputMaybe<Companies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Lead_TracksArgs = {
  objects: Array<Company_Lead_Tracks_Insert_Input>;
  on_conflict?: InputMaybe<Company_Lead_Tracks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Lead_Tracks_OneArgs = {
  object: Company_Lead_Tracks_Insert_Input;
  on_conflict?: InputMaybe<Company_Lead_Tracks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_LeadsArgs = {
  objects: Array<Company_Leads_Insert_Input>;
  on_conflict?: InputMaybe<Company_Leads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Leads_OneArgs = {
  object: Company_Leads_Insert_Input;
  on_conflict?: InputMaybe<Company_Leads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_PackagesArgs = {
  objects: Array<Company_Packages_Insert_Input>;
  on_conflict?: InputMaybe<Company_Packages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Packages_OneArgs = {
  object: Company_Packages_Insert_Input;
  on_conflict?: InputMaybe<Company_Packages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_ProductsArgs = {
  objects: Array<Company_Products_Insert_Input>;
  on_conflict?: InputMaybe<Company_Products_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Products_OneArgs = {
  object: Company_Products_Insert_Input;
  on_conflict?: InputMaybe<Company_Products_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_UsersArgs = {
  objects: Array<Company_Users_Insert_Input>;
  on_conflict?: InputMaybe<Company_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Company_Users_OneArgs = {
  object: Company_Users_Insert_Input;
  on_conflict?: InputMaybe<Company_Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ConfigsArgs = {
  objects: Array<Configs_Insert_Input>;
  on_conflict?: InputMaybe<Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Configs_OneArgs = {
  object: Configs_Insert_Input;
  on_conflict?: InputMaybe<Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Order_ItemsArgs = {
  objects: Array<Order_Items_Insert_Input>;
  on_conflict?: InputMaybe<Order_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Order_Items_OneArgs = {
  object: Order_Items_Insert_Input;
  on_conflict?: InputMaybe<Order_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrdersArgs = {
  objects: Array<Orders_Insert_Input>;
  on_conflict?: InputMaybe<Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Orders_OneArgs = {
  object: Orders_Insert_Input;
  on_conflict?: InputMaybe<Orders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Package_Product_SkusArgs = {
  objects: Array<Package_Product_Skus_Insert_Input>;
  on_conflict?: InputMaybe<Package_Product_Skus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Package_Product_Skus_OneArgs = {
  object: Package_Product_Skus_Insert_Input;
  on_conflict?: InputMaybe<Package_Product_Skus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PackagesArgs = {
  objects: Array<Packages_Insert_Input>;
  on_conflict?: InputMaybe<Packages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Packages_OneArgs = {
  object: Packages_Insert_Input;
  on_conflict?: InputMaybe<Packages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Product_SkusArgs = {
  objects: Array<Product_Skus_Insert_Input>;
  on_conflict?: InputMaybe<Product_Skus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Product_Skus_OneArgs = {
  object: Product_Skus_Insert_Input;
  on_conflict?: InputMaybe<Product_Skus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProductsArgs = {
  objects: Array<Products_Insert_Input>;
  on_conflict?: InputMaybe<Products_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Products_OneArgs = {
  object: Products_Insert_Input;
  on_conflict?: InputMaybe<Products_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AddressesArgs = {
  _inc?: InputMaybe<Addresses_Inc_Input>;
  _set?: InputMaybe<Addresses_Set_Input>;
  where: Addresses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Addresses_By_PkArgs = {
  _inc?: InputMaybe<Addresses_Inc_Input>;
  _set?: InputMaybe<Addresses_Set_Input>;
  pk_columns: Addresses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Addresses_ManyArgs = {
  updates: Array<Addresses_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CartsArgs = {
  _inc?: InputMaybe<Carts_Inc_Input>;
  _set?: InputMaybe<Carts_Set_Input>;
  where: Carts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Carts_By_PkArgs = {
  _inc?: InputMaybe<Carts_Inc_Input>;
  _set?: InputMaybe<Carts_Set_Input>;
  pk_columns: Carts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Carts_ManyArgs = {
  updates: Array<Carts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CategoriesArgs = {
  _inc?: InputMaybe<Categories_Inc_Input>;
  _set?: InputMaybe<Categories_Set_Input>;
  where: Categories_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Categories_By_PkArgs = {
  _inc?: InputMaybe<Categories_Inc_Input>;
  _set?: InputMaybe<Categories_Set_Input>;
  pk_columns: Categories_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Categories_ManyArgs = {
  updates: Array<Categories_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CompaniesArgs = {
  _inc?: InputMaybe<Companies_Inc_Input>;
  _set?: InputMaybe<Companies_Set_Input>;
  where: Companies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Companies_By_PkArgs = {
  _inc?: InputMaybe<Companies_Inc_Input>;
  _set?: InputMaybe<Companies_Set_Input>;
  pk_columns: Companies_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Companies_ManyArgs = {
  updates: Array<Companies_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Lead_TracksArgs = {
  _inc?: InputMaybe<Company_Lead_Tracks_Inc_Input>;
  _set?: InputMaybe<Company_Lead_Tracks_Set_Input>;
  where: Company_Lead_Tracks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Lead_Tracks_By_PkArgs = {
  _inc?: InputMaybe<Company_Lead_Tracks_Inc_Input>;
  _set?: InputMaybe<Company_Lead_Tracks_Set_Input>;
  pk_columns: Company_Lead_Tracks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Lead_Tracks_ManyArgs = {
  updates: Array<Company_Lead_Tracks_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Company_LeadsArgs = {
  _inc?: InputMaybe<Company_Leads_Inc_Input>;
  _set?: InputMaybe<Company_Leads_Set_Input>;
  where: Company_Leads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Leads_By_PkArgs = {
  _inc?: InputMaybe<Company_Leads_Inc_Input>;
  _set?: InputMaybe<Company_Leads_Set_Input>;
  pk_columns: Company_Leads_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Leads_ManyArgs = {
  updates: Array<Company_Leads_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Company_PackagesArgs = {
  _inc?: InputMaybe<Company_Packages_Inc_Input>;
  _set?: InputMaybe<Company_Packages_Set_Input>;
  where: Company_Packages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Packages_By_PkArgs = {
  _inc?: InputMaybe<Company_Packages_Inc_Input>;
  _set?: InputMaybe<Company_Packages_Set_Input>;
  pk_columns: Company_Packages_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Packages_ManyArgs = {
  updates: Array<Company_Packages_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Company_ProductsArgs = {
  _inc?: InputMaybe<Company_Products_Inc_Input>;
  _set?: InputMaybe<Company_Products_Set_Input>;
  where: Company_Products_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Products_By_PkArgs = {
  _inc?: InputMaybe<Company_Products_Inc_Input>;
  _set?: InputMaybe<Company_Products_Set_Input>;
  pk_columns: Company_Products_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Products_ManyArgs = {
  updates: Array<Company_Products_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Company_UsersArgs = {
  _inc?: InputMaybe<Company_Users_Inc_Input>;
  _set?: InputMaybe<Company_Users_Set_Input>;
  where: Company_Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Users_By_PkArgs = {
  _inc?: InputMaybe<Company_Users_Inc_Input>;
  _set?: InputMaybe<Company_Users_Set_Input>;
  pk_columns: Company_Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Company_Users_ManyArgs = {
  updates: Array<Company_Users_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ConfigsArgs = {
  _inc?: InputMaybe<Configs_Inc_Input>;
  _set?: InputMaybe<Configs_Set_Input>;
  where: Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Configs_By_PkArgs = {
  _inc?: InputMaybe<Configs_Inc_Input>;
  _set?: InputMaybe<Configs_Set_Input>;
  pk_columns: Configs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Configs_ManyArgs = {
  updates: Array<Configs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Order_ItemsArgs = {
  _inc?: InputMaybe<Order_Items_Inc_Input>;
  _set?: InputMaybe<Order_Items_Set_Input>;
  where: Order_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Order_Items_By_PkArgs = {
  _inc?: InputMaybe<Order_Items_Inc_Input>;
  _set?: InputMaybe<Order_Items_Set_Input>;
  pk_columns: Order_Items_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Order_Items_ManyArgs = {
  updates: Array<Order_Items_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_OrdersArgs = {
  _inc?: InputMaybe<Orders_Inc_Input>;
  _set?: InputMaybe<Orders_Set_Input>;
  where: Orders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_By_PkArgs = {
  _inc?: InputMaybe<Orders_Inc_Input>;
  _set?: InputMaybe<Orders_Set_Input>;
  pk_columns: Orders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Orders_ManyArgs = {
  updates: Array<Orders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Package_Product_SkusArgs = {
  _inc?: InputMaybe<Package_Product_Skus_Inc_Input>;
  _set?: InputMaybe<Package_Product_Skus_Set_Input>;
  where: Package_Product_Skus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Package_Product_Skus_By_PkArgs = {
  _inc?: InputMaybe<Package_Product_Skus_Inc_Input>;
  _set?: InputMaybe<Package_Product_Skus_Set_Input>;
  pk_columns: Package_Product_Skus_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Package_Product_Skus_ManyArgs = {
  updates: Array<Package_Product_Skus_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_PackagesArgs = {
  _inc?: InputMaybe<Packages_Inc_Input>;
  _set?: InputMaybe<Packages_Set_Input>;
  where: Packages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Packages_By_PkArgs = {
  _inc?: InputMaybe<Packages_Inc_Input>;
  _set?: InputMaybe<Packages_Set_Input>;
  pk_columns: Packages_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Packages_ManyArgs = {
  updates: Array<Packages_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Product_SkusArgs = {
  _inc?: InputMaybe<Product_Skus_Inc_Input>;
  _set?: InputMaybe<Product_Skus_Set_Input>;
  where: Product_Skus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Product_Skus_By_PkArgs = {
  _inc?: InputMaybe<Product_Skus_Inc_Input>;
  _set?: InputMaybe<Product_Skus_Set_Input>;
  pk_columns: Product_Skus_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Product_Skus_ManyArgs = {
  updates: Array<Product_Skus_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ProductsArgs = {
  _inc?: InputMaybe<Products_Inc_Input>;
  _set?: InputMaybe<Products_Set_Input>;
  where: Products_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Products_By_PkArgs = {
  _inc?: InputMaybe<Products_Inc_Input>;
  _set?: InputMaybe<Products_Set_Input>;
  pk_columns: Products_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Products_ManyArgs = {
  updates: Array<Products_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** 子订单 */
export type Order_Items = {
  __typename?: 'order_items';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  order: Orders;
  order_orders: Scalars['bigint']['output'];
  /** 商品图片快照 */
  product_image_url?: Maybe<Scalars['String']['output']>;
  /** 商品名称快照 */
  product_name?: Maybe<Scalars['String']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price: Scalars['numeric']['output'];
  /** An object relationship */
  product_sku: Product_Skus;
  /** 关联产品id */
  product_sku_product_skus: Scalars['bigint']['output'];
  /** 数量 */
  quantity: Scalars['bigint']['output'];
  /** 订单规格用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "order_items" */
export type Order_Items_Aggregate = {
  __typename?: 'order_items_aggregate';
  aggregate?: Maybe<Order_Items_Aggregate_Fields>;
  nodes: Array<Order_Items>;
};

export type Order_Items_Aggregate_Bool_Exp = {
  count?: InputMaybe<Order_Items_Aggregate_Bool_Exp_Count>;
};

export type Order_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Order_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Order_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "order_items" */
export type Order_Items_Aggregate_Fields = {
  __typename?: 'order_items_aggregate_fields';
  avg?: Maybe<Order_Items_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Order_Items_Max_Fields>;
  min?: Maybe<Order_Items_Min_Fields>;
  stddev?: Maybe<Order_Items_Stddev_Fields>;
  stddev_pop?: Maybe<Order_Items_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Order_Items_Stddev_Samp_Fields>;
  sum?: Maybe<Order_Items_Sum_Fields>;
  var_pop?: Maybe<Order_Items_Var_Pop_Fields>;
  var_samp?: Maybe<Order_Items_Var_Samp_Fields>;
  variance?: Maybe<Order_Items_Variance_Fields>;
};


/** aggregate fields of "order_items" */
export type Order_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Order_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "order_items" */
export type Order_Items_Aggregate_Order_By = {
  avg?: InputMaybe<Order_Items_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Order_Items_Max_Order_By>;
  min?: InputMaybe<Order_Items_Min_Order_By>;
  stddev?: InputMaybe<Order_Items_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Order_Items_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Order_Items_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Order_Items_Sum_Order_By>;
  var_pop?: InputMaybe<Order_Items_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Order_Items_Var_Samp_Order_By>;
  variance?: InputMaybe<Order_Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "order_items" */
export type Order_Items_Arr_Rel_Insert_Input = {
  data: Array<Order_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Order_Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Order_Items_Avg_Fields = {
  __typename?: 'order_items_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "order_items" */
export type Order_Items_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "order_items". All fields are combined with a logical 'AND'. */
export type Order_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Order_Items_Bool_Exp>>;
  _not?: InputMaybe<Order_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Order_Items_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  order?: InputMaybe<Orders_Bool_Exp>;
  order_orders?: InputMaybe<Bigint_Comparison_Exp>;
  product_image_url?: InputMaybe<String_Comparison_Exp>;
  product_name?: InputMaybe<String_Comparison_Exp>;
  product_price?: InputMaybe<Numeric_Comparison_Exp>;
  product_sku?: InputMaybe<Product_Skus_Bool_Exp>;
  product_sku_product_skus?: InputMaybe<Bigint_Comparison_Exp>;
  quantity?: InputMaybe<Bigint_Comparison_Exp>;
  remark?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "order_items" */
export enum Order_Items_Constraint {
  /** unique or primary key constraint on columns "product_sku_product_skus", "order_orders" */
  OrderItemsOrderOrdersProductSkuProductSkusKey = 'order_items_order_orders_product_sku_product_skus_key',
  /** unique or primary key constraint on columns "id" */
  OrderItemsPkey = 'order_items_pkey'
}

/** input type for incrementing numeric columns in table "order_items" */
export type Order_Items_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  order_orders?: InputMaybe<Scalars['bigint']['input']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "order_items" */
export type Order_Items_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  order?: InputMaybe<Orders_Obj_Rel_Insert_Input>;
  order_orders?: InputMaybe<Scalars['bigint']['input']>;
  /** 商品图片快照 */
  product_image_url?: InputMaybe<Scalars['String']['input']>;
  /** 商品名称快照 */
  product_name?: InputMaybe<Scalars['String']['input']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Scalars['numeric']['input']>;
  product_sku?: InputMaybe<Product_Skus_Obj_Rel_Insert_Input>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 订单规格用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Order_Items_Max_Fields = {
  __typename?: 'order_items_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  order_orders?: Maybe<Scalars['bigint']['output']>;
  /** 商品图片快照 */
  product_image_url?: Maybe<Scalars['String']['output']>;
  /** 商品名称快照 */
  product_name?: Maybe<Scalars['String']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 订单规格用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "order_items" */
export type Order_Items_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 商品图片快照 */
  product_image_url?: InputMaybe<Order_By>;
  /** 商品名称快照 */
  product_name?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 订单规格用户备注 */
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Order_Items_Min_Fields = {
  __typename?: 'order_items_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  order_orders?: Maybe<Scalars['bigint']['output']>;
  /** 商品图片快照 */
  product_image_url?: Maybe<Scalars['String']['output']>;
  /** 商品名称快照 */
  product_name?: Maybe<Scalars['String']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 订单规格用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "order_items" */
export type Order_Items_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 商品图片快照 */
  product_image_url?: InputMaybe<Order_By>;
  /** 商品名称快照 */
  product_name?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
  /** 订单规格用户备注 */
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "order_items" */
export type Order_Items_Mutation_Response = {
  __typename?: 'order_items_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Order_Items>;
};

/** on_conflict condition type for table "order_items" */
export type Order_Items_On_Conflict = {
  constraint: Order_Items_Constraint;
  update_columns?: Array<Order_Items_Update_Column>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "order_items". */
export type Order_Items_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order?: InputMaybe<Orders_Order_By>;
  order_orders?: InputMaybe<Order_By>;
  product_image_url?: InputMaybe<Order_By>;
  product_name?: InputMaybe<Order_By>;
  product_price?: InputMaybe<Order_By>;
  product_sku?: InputMaybe<Product_Skus_Order_By>;
  product_sku_product_skus?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  remark?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: order_items */
export type Order_Items_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "order_items" */
export enum Order_Items_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrderOrders = 'order_orders',
  /** column name */
  ProductImageUrl = 'product_image_url',
  /** column name */
  ProductName = 'product_name',
  /** column name */
  ProductPrice = 'product_price',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Remark = 'remark',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "order_items" */
export type Order_Items_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  order_orders?: InputMaybe<Scalars['bigint']['input']>;
  /** 商品图片快照 */
  product_image_url?: InputMaybe<Scalars['String']['input']>;
  /** 商品名称快照 */
  product_name?: InputMaybe<Scalars['String']['input']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 订单规格用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Order_Items_Stddev_Fields = {
  __typename?: 'order_items_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "order_items" */
export type Order_Items_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Order_Items_Stddev_Pop_Fields = {
  __typename?: 'order_items_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "order_items" */
export type Order_Items_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Order_Items_Stddev_Samp_Fields = {
  __typename?: 'order_items_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "order_items" */
export type Order_Items_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "order_items" */
export type Order_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Order_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Order_Items_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  order_orders?: InputMaybe<Scalars['bigint']['input']>;
  /** 商品图片快照 */
  product_image_url?: InputMaybe<Scalars['String']['input']>;
  /** 商品名称快照 */
  product_name?: InputMaybe<Scalars['String']['input']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** 数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 订单规格用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Order_Items_Sum_Fields = {
  __typename?: 'order_items_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  order_orders?: Maybe<Scalars['bigint']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "order_items" */
export type Order_Items_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** update columns of table "order_items" */
export enum Order_Items_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrderOrders = 'order_orders',
  /** column name */
  ProductImageUrl = 'product_image_url',
  /** column name */
  ProductName = 'product_name',
  /** column name */
  ProductPrice = 'product_price',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Remark = 'remark',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Order_Items_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Order_Items_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Order_Items_Set_Input>;
  /** filter the rows which have to be updated */
  where: Order_Items_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Order_Items_Var_Pop_Fields = {
  __typename?: 'order_items_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "order_items" */
export type Order_Items_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Order_Items_Var_Samp_Fields = {
  __typename?: 'order_items_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "order_items" */
export type Order_Items_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Order_Items_Variance_Fields = {
  __typename?: 'order_items_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  order_orders?: Maybe<Scalars['Float']['output']>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** 数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "order_items" */
export type Order_Items_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  order_orders?: InputMaybe<Order_By>;
  /** 单价，记录product_sku的价格，防止价格变动 */
  product_price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** 数量 */
  quantity?: InputMaybe<Order_By>;
};

/** 订单表 */
export type Orders = {
  __typename?: 'orders';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount: Scalars['numeric']['output'];
  /** An object relationship */
  company: Companies;
  /** 关联公司id，在哪个公司下单的 */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 是否删除 */
  is_deleted: Scalars['Boolean']['output'];
  /** An array relationship */
  order_items: Array<Order_Items>;
  /** An aggregate relationship */
  order_items_aggregate: Order_Items_Aggregate;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status: Scalars['String']['output'];
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status: Scalars['String']['output'];
  /** 下单用户在该公司的价格系数快照 */
  price_factor: Scalars['numeric']['output'];
  /** 收货地址 */
  receiver_address: Scalars['String']['output'];
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name: Scalars['String']['output'];
  /** 收货电话 */
  receiver_phone: Scalars['String']['output'];
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  /** 订单用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount: Scalars['numeric']['output'];
  /** 规格总价=所有规格单价*数量的总和 */
  total_price: Scalars['numeric']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  /** 关联用户id，谁下单的 */
  user_users: Scalars['bigint']['output'];
};


/** 订单表 */
export type OrdersOrder_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


/** 订单表 */
export type OrdersOrder_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};

/** aggregated selection of "orders" */
export type Orders_Aggregate = {
  __typename?: 'orders_aggregate';
  aggregate?: Maybe<Orders_Aggregate_Fields>;
  nodes: Array<Orders>;
};

export type Orders_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Orders_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Orders_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Orders_Aggregate_Bool_Exp_Count>;
};

export type Orders_Aggregate_Bool_Exp_Bool_And = {
  arguments: Orders_Select_Column_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Orders_Select_Column_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Orders_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Orders_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "orders" */
export type Orders_Aggregate_Fields = {
  __typename?: 'orders_aggregate_fields';
  avg?: Maybe<Orders_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Orders_Max_Fields>;
  min?: Maybe<Orders_Min_Fields>;
  stddev?: Maybe<Orders_Stddev_Fields>;
  stddev_pop?: Maybe<Orders_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Orders_Stddev_Samp_Fields>;
  sum?: Maybe<Orders_Sum_Fields>;
  var_pop?: Maybe<Orders_Var_Pop_Fields>;
  var_samp?: Maybe<Orders_Var_Samp_Fields>;
  variance?: Maybe<Orders_Variance_Fields>;
};


/** aggregate fields of "orders" */
export type Orders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Orders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "orders" */
export type Orders_Aggregate_Order_By = {
  avg?: InputMaybe<Orders_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Orders_Max_Order_By>;
  min?: InputMaybe<Orders_Min_Order_By>;
  stddev?: InputMaybe<Orders_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Orders_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Orders_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Orders_Sum_Order_By>;
  var_pop?: InputMaybe<Orders_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Orders_Var_Samp_Order_By>;
  variance?: InputMaybe<Orders_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "orders" */
export type Orders_Arr_Rel_Insert_Input = {
  data: Array<Orders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_On_Conflict>;
};

/** aggregate avg on columns */
export type Orders_Avg_Fields = {
  __typename?: 'orders_avg_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "orders" */
export type Orders_Avg_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "orders". All fields are combined with a logical 'AND'. */
export type Orders_Bool_Exp = {
  _and?: InputMaybe<Array<Orders_Bool_Exp>>;
  _not?: InputMaybe<Orders_Bool_Exp>;
  _or?: InputMaybe<Array<Orders_Bool_Exp>>;
  actual_amount?: InputMaybe<Numeric_Comparison_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  order_items?: InputMaybe<Order_Items_Bool_Exp>;
  order_items_aggregate?: InputMaybe<Order_Items_Aggregate_Bool_Exp>;
  order_status?: InputMaybe<String_Comparison_Exp>;
  payment_status?: InputMaybe<String_Comparison_Exp>;
  price_factor?: InputMaybe<Numeric_Comparison_Exp>;
  receiver_address?: InputMaybe<String_Comparison_Exp>;
  receiver_city?: InputMaybe<String_Comparison_Exp>;
  receiver_district?: InputMaybe<String_Comparison_Exp>;
  receiver_name?: InputMaybe<String_Comparison_Exp>;
  receiver_phone?: InputMaybe<String_Comparison_Exp>;
  receiver_province?: InputMaybe<String_Comparison_Exp>;
  remark?: InputMaybe<String_Comparison_Exp>;
  total_amount?: InputMaybe<Numeric_Comparison_Exp>;
  total_price?: InputMaybe<Numeric_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_users?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders" */
export enum Orders_Constraint {
  /** unique or primary key constraint on columns "id" */
  OrdersPkey = 'orders_pkey'
}

/** input type for incrementing numeric columns in table "orders" */
export type Orders_Inc_Input = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "orders" */
export type Orders_Insert_Input = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Scalars['numeric']['input']>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  order_items?: InputMaybe<Order_Items_Arr_Rel_Insert_Input>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: InputMaybe<Scalars['String']['input']>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: InputMaybe<Scalars['String']['input']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 收货地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  /** 订单用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Orders_Max_Fields = {
  __typename?: 'orders_max_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['numeric']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: Maybe<Scalars['String']['output']>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: Maybe<Scalars['String']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 收货地址 */
  receiver_address?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name?: Maybe<Scalars['String']['output']>;
  /** 收货电话 */
  receiver_phone?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  /** 订单用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['numeric']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "orders" */
export type Orders_Max_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: InputMaybe<Order_By>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 收货地址 */
  receiver_address?: InputMaybe<Order_By>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Order_By>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Order_By>;
  /** 收货人 */
  receiver_name?: InputMaybe<Order_By>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Order_By>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Order_By>;
  /** 订单用户备注 */
  remark?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Min_Fields = {
  __typename?: 'orders_min_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['numeric']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: Maybe<Scalars['String']['output']>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: Maybe<Scalars['String']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 收货地址 */
  receiver_address?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-市 */
  receiver_city?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-区 */
  receiver_district?: Maybe<Scalars['String']['output']>;
  /** 收货人 */
  receiver_name?: Maybe<Scalars['String']['output']>;
  /** 收货电话 */
  receiver_phone?: Maybe<Scalars['String']['output']>;
  /** 可不填，收货人-省 */
  receiver_province?: Maybe<Scalars['String']['output']>;
  /** 订单用户备注 */
  remark?: Maybe<Scalars['String']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['numeric']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['numeric']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "orders" */
export type Orders_Min_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: InputMaybe<Order_By>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 收货地址 */
  receiver_address?: InputMaybe<Order_By>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Order_By>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Order_By>;
  /** 收货人 */
  receiver_name?: InputMaybe<Order_By>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Order_By>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Order_By>;
  /** 订单用户备注 */
  remark?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "orders" */
export type Orders_Mutation_Response = {
  __typename?: 'orders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Orders>;
};

/** input type for inserting object relation for remote table "orders" */
export type Orders_Obj_Rel_Insert_Input = {
  data: Orders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Orders_On_Conflict>;
};

/** on_conflict condition type for table "orders" */
export type Orders_On_Conflict = {
  constraint: Orders_Constraint;
  update_columns?: Array<Orders_Update_Column>;
  where?: InputMaybe<Orders_Bool_Exp>;
};

/** Ordering options when selecting data from "orders". */
export type Orders_Order_By = {
  actual_amount?: InputMaybe<Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  order_items_aggregate?: InputMaybe<Order_Items_Aggregate_Order_By>;
  order_status?: InputMaybe<Order_By>;
  payment_status?: InputMaybe<Order_By>;
  price_factor?: InputMaybe<Order_By>;
  receiver_address?: InputMaybe<Order_By>;
  receiver_city?: InputMaybe<Order_By>;
  receiver_district?: InputMaybe<Order_By>;
  receiver_name?: InputMaybe<Order_By>;
  receiver_phone?: InputMaybe<Order_By>;
  receiver_province?: InputMaybe<Order_By>;
  remark?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
  total_price?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_users?: InputMaybe<Order_By>;
};

/** primary key columns input for table: orders */
export type Orders_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "orders" */
export enum Orders_Select_Column {
  /** column name */
  ActualAmount = 'actual_amount',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  OrderStatus = 'order_status',
  /** column name */
  PaymentStatus = 'payment_status',
  /** column name */
  PriceFactor = 'price_factor',
  /** column name */
  ReceiverAddress = 'receiver_address',
  /** column name */
  ReceiverCity = 'receiver_city',
  /** column name */
  ReceiverDistrict = 'receiver_district',
  /** column name */
  ReceiverName = 'receiver_name',
  /** column name */
  ReceiverPhone = 'receiver_phone',
  /** column name */
  ReceiverProvince = 'receiver_province',
  /** column name */
  Remark = 'remark',
  /** column name */
  TotalAmount = 'total_amount',
  /** column name */
  TotalPrice = 'total_price',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

/** select "orders_aggregate_bool_exp_bool_and_arguments_columns" columns of table "orders" */
export enum Orders_Select_Column_Orders_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted'
}

/** select "orders_aggregate_bool_exp_bool_or_arguments_columns" columns of table "orders" */
export enum Orders_Select_Column_Orders_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted'
}

/** input type for updating data in table "orders" */
export type Orders_Set_Input = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: InputMaybe<Scalars['String']['input']>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: InputMaybe<Scalars['String']['input']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 收货地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  /** 订单用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Orders_Stddev_Fields = {
  __typename?: 'orders_stddev_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "orders" */
export type Orders_Stddev_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Orders_Stddev_Pop_Fields = {
  __typename?: 'orders_stddev_pop_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "orders" */
export type Orders_Stddev_Pop_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Orders_Stddev_Samp_Fields = {
  __typename?: 'orders_stddev_samp_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "orders" */
export type Orders_Stddev_Samp_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "orders" */
export type Orders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Orders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Orders_Stream_Cursor_Value_Input = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** -- 状态值： -- pending: 等待确认（用户提交了订单，管理员没有确认，用户可能已经付款了，也可能没有） -- confirmed: 已确认（管理员完成确认了订单可以发货，此时会锁库存，但用户不一定付款了）-- completed: 已完成（订单完成结束，对应的payment_status是approved） */
  order_status?: InputMaybe<Scalars['String']['input']>;
  /** -- 支付审核状态（管理员设置）： -- pending: 待支付（用户尚未支付） -- approved: 已通过（管理员确认用户订单已经付款了） */
  payment_status?: InputMaybe<Scalars['String']['input']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Scalars['numeric']['input']>;
  /** 收货地址 */
  receiver_address?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-市 */
  receiver_city?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-区 */
  receiver_district?: InputMaybe<Scalars['String']['input']>;
  /** 收货人 */
  receiver_name?: InputMaybe<Scalars['String']['input']>;
  /** 收货电话 */
  receiver_phone?: InputMaybe<Scalars['String']['input']>;
  /** 可不填，收货人-省 */
  receiver_province?: InputMaybe<Scalars['String']['input']>;
  /** 订单用户备注 */
  remark?: InputMaybe<Scalars['String']['input']>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Scalars['numeric']['input']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Scalars['numeric']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Orders_Sum_Fields = {
  __typename?: 'orders_sum_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['numeric']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['numeric']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['numeric']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['numeric']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "orders" */
export type Orders_Sum_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** update columns of table "orders" */
export enum Orders_Update_Column {
  /** column name */
  ActualAmount = 'actual_amount',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  OrderStatus = 'order_status',
  /** column name */
  PaymentStatus = 'payment_status',
  /** column name */
  PriceFactor = 'price_factor',
  /** column name */
  ReceiverAddress = 'receiver_address',
  /** column name */
  ReceiverCity = 'receiver_city',
  /** column name */
  ReceiverDistrict = 'receiver_district',
  /** column name */
  ReceiverName = 'receiver_name',
  /** column name */
  ReceiverPhone = 'receiver_phone',
  /** column name */
  ReceiverProvince = 'receiver_province',
  /** column name */
  Remark = 'remark',
  /** column name */
  TotalAmount = 'total_amount',
  /** column name */
  TotalPrice = 'total_price',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserUsers = 'user_users'
}

export type Orders_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Orders_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Orders_Set_Input>;
  /** filter the rows which have to be updated */
  where: Orders_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Orders_Var_Pop_Fields = {
  __typename?: 'orders_var_pop_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "orders" */
export type Orders_Var_Pop_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Orders_Var_Samp_Fields = {
  __typename?: 'orders_var_samp_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "orders" */
export type Orders_Var_Samp_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Orders_Variance_Fields = {
  __typename?: 'orders_variance_fields';
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: Maybe<Scalars['Float']['output']>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: Maybe<Scalars['Float']['output']>;
  /** 总金额，总价*价格系数 */
  total_amount?: Maybe<Scalars['Float']['output']>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: Maybe<Scalars['Float']['output']>;
  /** 关联用户id，谁下单的 */
  user_users?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "orders" */
export type Orders_Variance_Order_By = {
  /** 实际支付金额，由公司管理员设置确认，用于真实的统计 */
  actual_amount?: InputMaybe<Order_By>;
  /** 关联公司id，在哪个公司下单的 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 下单用户在该公司的价格系数快照 */
  price_factor?: InputMaybe<Order_By>;
  /** 总金额，总价*价格系数 */
  total_amount?: InputMaybe<Order_By>;
  /** 规格总价=所有规格单价*数量的总和 */
  total_price?: InputMaybe<Order_By>;
  /** 关联用户id，谁下单的 */
  user_users?: InputMaybe<Order_By>;
};

/** 套餐包含的产品规格 */
export type Package_Product_Skus = {
  __typename?: 'package_product_skus';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** An object relationship */
  package: Packages;
  /** 套餐id */
  package_packages: Scalars['bigint']['output'];
  /** An object relationship */
  product_sku: Product_Skus;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus: Scalars['bigint']['output'];
  /** SKU数量 */
  quantity: Scalars['bigint']['output'];
  /** 排序，越小越前 */
  sort_order: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "package_product_skus" */
export type Package_Product_Skus_Aggregate = {
  __typename?: 'package_product_skus_aggregate';
  aggregate?: Maybe<Package_Product_Skus_Aggregate_Fields>;
  nodes: Array<Package_Product_Skus>;
};

export type Package_Product_Skus_Aggregate_Bool_Exp = {
  count?: InputMaybe<Package_Product_Skus_Aggregate_Bool_Exp_Count>;
};

export type Package_Product_Skus_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Package_Product_Skus_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "package_product_skus" */
export type Package_Product_Skus_Aggregate_Fields = {
  __typename?: 'package_product_skus_aggregate_fields';
  avg?: Maybe<Package_Product_Skus_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Package_Product_Skus_Max_Fields>;
  min?: Maybe<Package_Product_Skus_Min_Fields>;
  stddev?: Maybe<Package_Product_Skus_Stddev_Fields>;
  stddev_pop?: Maybe<Package_Product_Skus_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Package_Product_Skus_Stddev_Samp_Fields>;
  sum?: Maybe<Package_Product_Skus_Sum_Fields>;
  var_pop?: Maybe<Package_Product_Skus_Var_Pop_Fields>;
  var_samp?: Maybe<Package_Product_Skus_Var_Samp_Fields>;
  variance?: Maybe<Package_Product_Skus_Variance_Fields>;
};


/** aggregate fields of "package_product_skus" */
export type Package_Product_Skus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "package_product_skus" */
export type Package_Product_Skus_Aggregate_Order_By = {
  avg?: InputMaybe<Package_Product_Skus_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Package_Product_Skus_Max_Order_By>;
  min?: InputMaybe<Package_Product_Skus_Min_Order_By>;
  stddev?: InputMaybe<Package_Product_Skus_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Package_Product_Skus_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Package_Product_Skus_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Package_Product_Skus_Sum_Order_By>;
  var_pop?: InputMaybe<Package_Product_Skus_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Package_Product_Skus_Var_Samp_Order_By>;
  variance?: InputMaybe<Package_Product_Skus_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "package_product_skus" */
export type Package_Product_Skus_Arr_Rel_Insert_Input = {
  data: Array<Package_Product_Skus_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Package_Product_Skus_On_Conflict>;
};

/** aggregate avg on columns */
export type Package_Product_Skus_Avg_Fields = {
  __typename?: 'package_product_skus_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "package_product_skus" */
export type Package_Product_Skus_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "package_product_skus". All fields are combined with a logical 'AND'. */
export type Package_Product_Skus_Bool_Exp = {
  _and?: InputMaybe<Array<Package_Product_Skus_Bool_Exp>>;
  _not?: InputMaybe<Package_Product_Skus_Bool_Exp>;
  _or?: InputMaybe<Array<Package_Product_Skus_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  package?: InputMaybe<Packages_Bool_Exp>;
  package_packages?: InputMaybe<Bigint_Comparison_Exp>;
  product_sku?: InputMaybe<Product_Skus_Bool_Exp>;
  product_sku_product_skus?: InputMaybe<Bigint_Comparison_Exp>;
  quantity?: InputMaybe<Bigint_Comparison_Exp>;
  sort_order?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "package_product_skus" */
export enum Package_Product_Skus_Constraint {
  /** unique or primary key constraint on columns "package_packages", "product_sku_product_skus" */
  PackageProductSkusPackagePackagesProductSkuProductSkus = 'package_product_skus_package_packages_product_sku_product_skus_',
  /** unique or primary key constraint on columns "id" */
  PackageProductSkusPkey = 'package_product_skus_pkey'
}

/** input type for incrementing numeric columns in table "package_product_skus" */
export type Package_Product_Skus_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 套餐id */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "package_product_skus" */
export type Package_Product_Skus_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  package?: InputMaybe<Packages_Obj_Rel_Insert_Input>;
  /** 套餐id */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  product_sku?: InputMaybe<Product_Skus_Obj_Rel_Insert_Input>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Package_Product_Skus_Max_Fields = {
  __typename?: 'package_product_skus_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['bigint']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "package_product_skus" */
export type Package_Product_Skus_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Package_Product_Skus_Min_Fields = {
  __typename?: 'package_product_skus_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['bigint']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "package_product_skus" */
export type Package_Product_Skus_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "package_product_skus" */
export type Package_Product_Skus_Mutation_Response = {
  __typename?: 'package_product_skus_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Package_Product_Skus>;
};

/** on_conflict condition type for table "package_product_skus" */
export type Package_Product_Skus_On_Conflict = {
  constraint: Package_Product_Skus_Constraint;
  update_columns?: Array<Package_Product_Skus_Update_Column>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};

/** Ordering options when selecting data from "package_product_skus". */
export type Package_Product_Skus_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  package?: InputMaybe<Packages_Order_By>;
  package_packages?: InputMaybe<Order_By>;
  product_sku?: InputMaybe<Product_Skus_Order_By>;
  product_sku_product_skus?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  sort_order?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: package_product_skus */
export type Package_Product_Skus_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "package_product_skus" */
export enum Package_Product_Skus_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PackagePackages = 'package_packages',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "package_product_skus" */
export type Package_Product_Skus_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 套餐id */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Package_Product_Skus_Stddev_Fields = {
  __typename?: 'package_product_skus_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "package_product_skus" */
export type Package_Product_Skus_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Package_Product_Skus_Stddev_Pop_Fields = {
  __typename?: 'package_product_skus_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "package_product_skus" */
export type Package_Product_Skus_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Package_Product_Skus_Stddev_Samp_Fields = {
  __typename?: 'package_product_skus_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "package_product_skus" */
export type Package_Product_Skus_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "package_product_skus" */
export type Package_Product_Skus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Package_Product_Skus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Package_Product_Skus_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 套餐id */
  package_packages?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Scalars['bigint']['input']>;
  /** SKU数量 */
  quantity?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Package_Product_Skus_Sum_Fields = {
  __typename?: 'package_product_skus_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['bigint']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['bigint']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "package_product_skus" */
export type Package_Product_Skus_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** update columns of table "package_product_skus" */
export enum Package_Product_Skus_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PackagePackages = 'package_packages',
  /** column name */
  ProductSkuProductSkus = 'product_sku_product_skus',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Package_Product_Skus_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Package_Product_Skus_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Package_Product_Skus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Package_Product_Skus_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Package_Product_Skus_Var_Pop_Fields = {
  __typename?: 'package_product_skus_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "package_product_skus" */
export type Package_Product_Skus_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Package_Product_Skus_Var_Samp_Fields = {
  __typename?: 'package_product_skus_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "package_product_skus" */
export type Package_Product_Skus_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Package_Product_Skus_Variance_Fields = {
  __typename?: 'package_product_skus_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  /** 套餐id */
  package_packages?: Maybe<Scalars['Float']['output']>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: Maybe<Scalars['Float']['output']>;
  /** SKU数量 */
  quantity?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小越前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "package_product_skus" */
export type Package_Product_Skus_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  /** 套餐id */
  package_packages?: InputMaybe<Order_By>;
  /** SKU id（上架时只能选系统默认公司和自己公司的sku） */
  product_sku_product_skus?: InputMaybe<Order_By>;
  /** SKU数量 */
  quantity?: InputMaybe<Order_By>;
  /** 排序，越小越前 */
  sort_order?: InputMaybe<Order_By>;
};

/** 套餐表 */
export type Packages = {
  __typename?: 'packages';
  /** An object relationship */
  category?: Maybe<Categories>;
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  company: Companies;
  /** 哪个公司的套餐 */
  company_companies: Scalars['bigint']['output'];
  /** An array relationship */
  company_packages: Array<Company_Packages>;
  /** An aggregate relationship */
  company_packages_aggregate: Company_Packages_Aggregate;
  /** 套餐封面图 */
  cover_image_url: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** 套餐介绍 */
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  /** 是否下架 */
  is_shelved: Scalars['Boolean']['output'];
  /** 套餐名称 */
  name: Scalars['String']['output'];
  /** An array relationship */
  package_product_skus: Array<Package_Product_Skus>;
  /** An aggregate relationship */
  package_product_skus_aggregate: Package_Product_Skus_Aggregate;
  /** 排序，越小的在前面 */
  sort_order: Scalars['bigint']['output'];
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};


/** 套餐表 */
export type PackagesCompany_PackagesArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


/** 套餐表 */
export type PackagesCompany_Packages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


/** 套餐表 */
export type PackagesPackage_Product_SkusArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


/** 套餐表 */
export type PackagesPackage_Product_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};

/** aggregated selection of "packages" */
export type Packages_Aggregate = {
  __typename?: 'packages_aggregate';
  aggregate?: Maybe<Packages_Aggregate_Fields>;
  nodes: Array<Packages>;
};

export type Packages_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Packages_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Packages_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Packages_Aggregate_Bool_Exp_Count>;
};

export type Packages_Aggregate_Bool_Exp_Bool_And = {
  arguments: Packages_Select_Column_Packages_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Packages_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Packages_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Packages_Select_Column_Packages_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Packages_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Packages_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Packages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Packages_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "packages" */
export type Packages_Aggregate_Fields = {
  __typename?: 'packages_aggregate_fields';
  avg?: Maybe<Packages_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Packages_Max_Fields>;
  min?: Maybe<Packages_Min_Fields>;
  stddev?: Maybe<Packages_Stddev_Fields>;
  stddev_pop?: Maybe<Packages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Packages_Stddev_Samp_Fields>;
  sum?: Maybe<Packages_Sum_Fields>;
  var_pop?: Maybe<Packages_Var_Pop_Fields>;
  var_samp?: Maybe<Packages_Var_Samp_Fields>;
  variance?: Maybe<Packages_Variance_Fields>;
};


/** aggregate fields of "packages" */
export type Packages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Packages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "packages" */
export type Packages_Aggregate_Order_By = {
  avg?: InputMaybe<Packages_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Packages_Max_Order_By>;
  min?: InputMaybe<Packages_Min_Order_By>;
  stddev?: InputMaybe<Packages_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Packages_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Packages_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Packages_Sum_Order_By>;
  var_pop?: InputMaybe<Packages_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Packages_Var_Samp_Order_By>;
  variance?: InputMaybe<Packages_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "packages" */
export type Packages_Arr_Rel_Insert_Input = {
  data: Array<Packages_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Packages_On_Conflict>;
};

/** aggregate avg on columns */
export type Packages_Avg_Fields = {
  __typename?: 'packages_avg_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "packages" */
export type Packages_Avg_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "packages". All fields are combined with a logical 'AND'. */
export type Packages_Bool_Exp = {
  _and?: InputMaybe<Array<Packages_Bool_Exp>>;
  _not?: InputMaybe<Packages_Bool_Exp>;
  _or?: InputMaybe<Array<Packages_Bool_Exp>>;
  category?: InputMaybe<Categories_Bool_Exp>;
  category_categories?: InputMaybe<Bigint_Comparison_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  company_packages?: InputMaybe<Company_Packages_Bool_Exp>;
  company_packages_aggregate?: InputMaybe<Company_Packages_Aggregate_Bool_Exp>;
  cover_image_url?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_shelved?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  package_product_skus?: InputMaybe<Package_Product_Skus_Bool_Exp>;
  package_product_skus_aggregate?: InputMaybe<Package_Product_Skus_Aggregate_Bool_Exp>;
  sort_order?: InputMaybe<Bigint_Comparison_Exp>;
  tags?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "packages" */
export enum Packages_Constraint {
  /** unique or primary key constraint on columns "id" */
  PackagesPkey = 'packages_pkey'
}

/** input type for incrementing numeric columns in table "packages" */
export type Packages_Inc_Input = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "packages" */
export type Packages_Insert_Input = {
  category?: InputMaybe<Categories_Obj_Rel_Insert_Input>;
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  company_packages?: InputMaybe<Company_Packages_Arr_Rel_Insert_Input>;
  /** 套餐封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 套餐介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 套餐名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  package_product_skus?: InputMaybe<Package_Product_Skus_Arr_Rel_Insert_Input>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Packages_Max_Fields = {
  __typename?: 'packages_max_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 套餐封面图 */
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 套餐介绍 */
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 套餐名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "packages" */
export type Packages_Max_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  /** 套餐封面图 */
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 套餐介绍 */
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 套餐名称 */
  name?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Packages_Min_Fields = {
  __typename?: 'packages_min_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 套餐封面图 */
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 套餐介绍 */
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 套餐名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "packages" */
export type Packages_Min_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  /** 套餐封面图 */
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 套餐介绍 */
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 套餐名称 */
  name?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "packages" */
export type Packages_Mutation_Response = {
  __typename?: 'packages_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Packages>;
};

/** input type for inserting object relation for remote table "packages" */
export type Packages_Obj_Rel_Insert_Input = {
  data: Packages_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Packages_On_Conflict>;
};

/** on_conflict condition type for table "packages" */
export type Packages_On_Conflict = {
  constraint: Packages_Constraint;
  update_columns?: Array<Packages_Update_Column>;
  where?: InputMaybe<Packages_Bool_Exp>;
};

/** Ordering options when selecting data from "packages". */
export type Packages_Order_By = {
  category?: InputMaybe<Categories_Order_By>;
  category_categories?: InputMaybe<Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  company_packages_aggregate?: InputMaybe<Company_Packages_Aggregate_Order_By>;
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_shelved?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  package_product_skus_aggregate?: InputMaybe<Package_Product_Skus_Aggregate_Order_By>;
  sort_order?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: packages */
export type Packages_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "packages" */
export enum Packages_Select_Column {
  /** column name */
  CategoryCategories = 'category_categories',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CoverImageUrl = 'cover_image_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "packages_aggregate_bool_exp_bool_and_arguments_columns" columns of table "packages" */
export enum Packages_Select_Column_Packages_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsShelved = 'is_shelved'
}

/** select "packages_aggregate_bool_exp_bool_or_arguments_columns" columns of table "packages" */
export enum Packages_Select_Column_Packages_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsShelved = 'is_shelved'
}

/** input type for updating data in table "packages" */
export type Packages_Set_Input = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 套餐封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 套餐介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 套餐名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Packages_Stddev_Fields = {
  __typename?: 'packages_stddev_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "packages" */
export type Packages_Stddev_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Packages_Stddev_Pop_Fields = {
  __typename?: 'packages_stddev_pop_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "packages" */
export type Packages_Stddev_Pop_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Packages_Stddev_Samp_Fields = {
  __typename?: 'packages_stddev_samp_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "packages" */
export type Packages_Stddev_Samp_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "packages" */
export type Packages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Packages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Packages_Stream_Cursor_Value_Input = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 套餐封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 套餐介绍 */
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 套餐名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Packages_Sum_Fields = {
  __typename?: 'packages_sum_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "packages" */
export type Packages_Sum_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** update columns of table "packages" */
export enum Packages_Update_Column {
  /** column name */
  CategoryCategories = 'category_categories',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CoverImageUrl = 'cover_image_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Packages_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Packages_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Packages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Packages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Packages_Var_Pop_Fields = {
  __typename?: 'packages_var_pop_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "packages" */
export type Packages_Var_Pop_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Packages_Var_Samp_Fields = {
  __typename?: 'packages_var_samp_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "packages" */
export type Packages_Var_Samp_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Packages_Variance_Fields = {
  __typename?: 'packages_variance_fields';
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 哪个公司的套餐 */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "packages" */
export type Packages_Variance_Order_By = {
  /** 分类id，上架时只能选择系统默认公司和自己公司的分类数据 */
  category_categories?: InputMaybe<Order_By>;
  /** 哪个公司的套餐 */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序，越小的在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** 产品下的规格 */
export type Product_Skus = {
  __typename?: 'product_skus';
  /** An array relationship */
  carts: Array<Carts>;
  /** An aggregate relationship */
  carts_aggregate: Carts_Aggregate;
  /** An object relationship */
  company: Companies;
  /** 关联公司id */
  company_companies: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 可选，规格图片 */
  image_url?: Maybe<Scalars['String']['output']>;
  /** 是否删除 */
  is_deleted: Scalars['Boolean']['output'];
  /** 是否下架 */
  is_shelved: Scalars['Boolean']['output'];
  /** 规格名称 */
  name: Scalars['String']['output'];
  /** An array relationship */
  order_items: Array<Order_Items>;
  /** An aggregate relationship */
  order_items_aggregate: Order_Items_Aggregate;
  /** An array relationship */
  package_product_skus: Array<Package_Product_Skus>;
  /** An aggregate relationship */
  package_product_skus_aggregate: Package_Product_Skus_Aggregate;
  /** 价格 */
  price: Scalars['numeric']['output'];
  /** An object relationship */
  product: Products;
  /** 关联产品id */
  product_products: Scalars['bigint']['output'];
  /** 排序，越小的在前 */
  sort_order: Scalars['bigint']['output'];
  /** 库存 */
  stock: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
};


/** 产品下的规格 */
export type Product_SkusCartsArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


/** 产品下的规格 */
export type Product_SkusCarts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


/** 产品下的规格 */
export type Product_SkusOrder_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


/** 产品下的规格 */
export type Product_SkusOrder_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


/** 产品下的规格 */
export type Product_SkusPackage_Product_SkusArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


/** 产品下的规格 */
export type Product_SkusPackage_Product_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};

/** aggregated selection of "product_skus" */
export type Product_Skus_Aggregate = {
  __typename?: 'product_skus_aggregate';
  aggregate?: Maybe<Product_Skus_Aggregate_Fields>;
  nodes: Array<Product_Skus>;
};

export type Product_Skus_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Product_Skus_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Product_Skus_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Product_Skus_Aggregate_Bool_Exp_Count>;
};

export type Product_Skus_Aggregate_Bool_Exp_Bool_And = {
  arguments: Product_Skus_Select_Column_Product_Skus_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Product_Skus_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Product_Skus_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Product_Skus_Select_Column_Product_Skus_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Product_Skus_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Product_Skus_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Product_Skus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Product_Skus_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "product_skus" */
export type Product_Skus_Aggregate_Fields = {
  __typename?: 'product_skus_aggregate_fields';
  avg?: Maybe<Product_Skus_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Product_Skus_Max_Fields>;
  min?: Maybe<Product_Skus_Min_Fields>;
  stddev?: Maybe<Product_Skus_Stddev_Fields>;
  stddev_pop?: Maybe<Product_Skus_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Product_Skus_Stddev_Samp_Fields>;
  sum?: Maybe<Product_Skus_Sum_Fields>;
  var_pop?: Maybe<Product_Skus_Var_Pop_Fields>;
  var_samp?: Maybe<Product_Skus_Var_Samp_Fields>;
  variance?: Maybe<Product_Skus_Variance_Fields>;
};


/** aggregate fields of "product_skus" */
export type Product_Skus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Product_Skus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "product_skus" */
export type Product_Skus_Aggregate_Order_By = {
  avg?: InputMaybe<Product_Skus_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Product_Skus_Max_Order_By>;
  min?: InputMaybe<Product_Skus_Min_Order_By>;
  stddev?: InputMaybe<Product_Skus_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Product_Skus_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Product_Skus_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Product_Skus_Sum_Order_By>;
  var_pop?: InputMaybe<Product_Skus_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Product_Skus_Var_Samp_Order_By>;
  variance?: InputMaybe<Product_Skus_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "product_skus" */
export type Product_Skus_Arr_Rel_Insert_Input = {
  data: Array<Product_Skus_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Product_Skus_On_Conflict>;
};

/** aggregate avg on columns */
export type Product_Skus_Avg_Fields = {
  __typename?: 'product_skus_avg_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "product_skus" */
export type Product_Skus_Avg_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "product_skus". All fields are combined with a logical 'AND'. */
export type Product_Skus_Bool_Exp = {
  _and?: InputMaybe<Array<Product_Skus_Bool_Exp>>;
  _not?: InputMaybe<Product_Skus_Bool_Exp>;
  _or?: InputMaybe<Array<Product_Skus_Bool_Exp>>;
  carts?: InputMaybe<Carts_Bool_Exp>;
  carts_aggregate?: InputMaybe<Carts_Aggregate_Bool_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  image_url?: InputMaybe<String_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  is_shelved?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  order_items?: InputMaybe<Order_Items_Bool_Exp>;
  order_items_aggregate?: InputMaybe<Order_Items_Aggregate_Bool_Exp>;
  package_product_skus?: InputMaybe<Package_Product_Skus_Bool_Exp>;
  package_product_skus_aggregate?: InputMaybe<Package_Product_Skus_Aggregate_Bool_Exp>;
  price?: InputMaybe<Numeric_Comparison_Exp>;
  product?: InputMaybe<Products_Bool_Exp>;
  product_products?: InputMaybe<Bigint_Comparison_Exp>;
  sort_order?: InputMaybe<Bigint_Comparison_Exp>;
  stock?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "product_skus" */
export enum Product_Skus_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProductSkusPkey = 'product_skus_pkey'
}

/** input type for incrementing numeric columns in table "product_skus" */
export type Product_Skus_Inc_Input = {
  /** 关联公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 价格 */
  price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 库存 */
  stock?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "product_skus" */
export type Product_Skus_Insert_Input = {
  carts?: InputMaybe<Carts_Arr_Rel_Insert_Input>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 关联公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选，规格图片 */
  image_url?: InputMaybe<Scalars['String']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 规格名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  order_items?: InputMaybe<Order_Items_Arr_Rel_Insert_Input>;
  package_product_skus?: InputMaybe<Package_Product_Skus_Arr_Rel_Insert_Input>;
  /** 价格 */
  price?: InputMaybe<Scalars['numeric']['input']>;
  product?: InputMaybe<Products_Obj_Rel_Insert_Input>;
  /** 关联产品id */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 库存 */
  stock?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Product_Skus_Max_Fields = {
  __typename?: 'product_skus_max_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 可选，规格图片 */
  image_url?: Maybe<Scalars['String']['output']>;
  /** 规格名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "product_skus" */
export type Product_Skus_Max_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 可选，规格图片 */
  image_url?: InputMaybe<Order_By>;
  /** 规格名称 */
  name?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Product_Skus_Min_Fields = {
  __typename?: 'product_skus_min_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 可选，规格图片 */
  image_url?: Maybe<Scalars['String']['output']>;
  /** 规格名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "product_skus" */
export type Product_Skus_Min_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 可选，规格图片 */
  image_url?: InputMaybe<Order_By>;
  /** 规格名称 */
  name?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "product_skus" */
export type Product_Skus_Mutation_Response = {
  __typename?: 'product_skus_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Product_Skus>;
};

/** input type for inserting object relation for remote table "product_skus" */
export type Product_Skus_Obj_Rel_Insert_Input = {
  data: Product_Skus_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Product_Skus_On_Conflict>;
};

/** on_conflict condition type for table "product_skus" */
export type Product_Skus_On_Conflict = {
  constraint: Product_Skus_Constraint;
  update_columns?: Array<Product_Skus_Update_Column>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};

/** Ordering options when selecting data from "product_skus". */
export type Product_Skus_Order_By = {
  carts_aggregate?: InputMaybe<Carts_Aggregate_Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  is_shelved?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  order_items_aggregate?: InputMaybe<Order_Items_Aggregate_Order_By>;
  package_product_skus_aggregate?: InputMaybe<Package_Product_Skus_Aggregate_Order_By>;
  price?: InputMaybe<Order_By>;
  product?: InputMaybe<Products_Order_By>;
  product_products?: InputMaybe<Order_By>;
  sort_order?: InputMaybe<Order_By>;
  stock?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: product_skus */
export type Product_Skus_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "product_skus" */
export enum Product_Skus_Select_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  Price = 'price',
  /** column name */
  ProductProducts = 'product_products',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Stock = 'stock',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "product_skus_aggregate_bool_exp_bool_and_arguments_columns" columns of table "product_skus" */
export enum Product_Skus_Select_Column_Product_Skus_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved'
}

/** select "product_skus_aggregate_bool_exp_bool_or_arguments_columns" columns of table "product_skus" */
export enum Product_Skus_Select_Column_Product_Skus_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved'
}

/** input type for updating data in table "product_skus" */
export type Product_Skus_Set_Input = {
  /** 关联公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选，规格图片 */
  image_url?: InputMaybe<Scalars['String']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 规格名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 价格 */
  price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 库存 */
  stock?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Product_Skus_Stddev_Fields = {
  __typename?: 'product_skus_stddev_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "product_skus" */
export type Product_Skus_Stddev_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Product_Skus_Stddev_Pop_Fields = {
  __typename?: 'product_skus_stddev_pop_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "product_skus" */
export type Product_Skus_Stddev_Pop_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Product_Skus_Stddev_Samp_Fields = {
  __typename?: 'product_skus_stddev_samp_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "product_skus" */
export type Product_Skus_Stddev_Samp_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "product_skus" */
export type Product_Skus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Product_Skus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Product_Skus_Stream_Cursor_Value_Input = {
  /** 关联公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 可选，规格图片 */
  image_url?: InputMaybe<Scalars['String']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 规格名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 价格 */
  price?: InputMaybe<Scalars['numeric']['input']>;
  /** 关联产品id */
  product_products?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 库存 */
  stock?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Product_Skus_Sum_Fields = {
  __typename?: 'product_skus_sum_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['numeric']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['bigint']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "product_skus" */
export type Product_Skus_Sum_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** update columns of table "product_skus" */
export enum Product_Skus_Update_Column {
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  Price = 'price',
  /** column name */
  ProductProducts = 'product_products',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Stock = 'stock',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Product_Skus_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Product_Skus_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Product_Skus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Product_Skus_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Product_Skus_Var_Pop_Fields = {
  __typename?: 'product_skus_var_pop_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "product_skus" */
export type Product_Skus_Var_Pop_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Product_Skus_Var_Samp_Fields = {
  __typename?: 'product_skus_var_samp_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "product_skus" */
export type Product_Skus_Var_Samp_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Product_Skus_Variance_Fields = {
  __typename?: 'product_skus_variance_fields';
  /** 关联公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 价格 */
  price?: Maybe<Scalars['Float']['output']>;
  /** 关联产品id */
  product_products?: Maybe<Scalars['Float']['output']>;
  /** 排序，越小的在前 */
  sort_order?: Maybe<Scalars['Float']['output']>;
  /** 库存 */
  stock?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "product_skus" */
export type Product_Skus_Variance_Order_By = {
  /** 关联公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 价格 */
  price?: InputMaybe<Order_By>;
  /** 关联产品id */
  product_products?: InputMaybe<Order_By>;
  /** 排序，越小的在前 */
  sort_order?: InputMaybe<Order_By>;
  /** 库存 */
  stock?: InputMaybe<Order_By>;
};

/** 产品表 */
export type Products = {
  __typename?: 'products';
  /** An object relationship */
  category?: Maybe<Categories>;
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** An object relationship */
  company: Companies;
  /** 归属公司id */
  company_companies: Scalars['bigint']['output'];
  /** An array relationship */
  company_products: Array<Company_Products>;
  /** An aggregate relationship */
  company_products_aggregate: Company_Products_Aggregate;
  /** 封面图 */
  cover_image_url: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** 商品介绍，富文本 */
  description?: Maybe<Scalars['String']['output']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias: Array<Scalars['json']['output']>;
  id: Scalars['bigint']['output'];
  /** 是否删除 */
  is_deleted: Scalars['Boolean']['output'];
  /** 是否下架 */
  is_shelved: Scalars['Boolean']['output'];
  /** 产品名称 */
  name: Scalars['String']['output'];
  /** An array relationship */
  product_skus: Array<Product_Skus>;
  /** An aggregate relationship */
  product_skus_aggregate: Product_Skus_Aggregate;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias: Array<Scalars['json']['output']>;
  /** 排序 越小在前面 */
  sort_order: Scalars['bigint']['output'];
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};


/** 产品表 */
export type ProductsCompany_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


/** 产品表 */
export type ProductsCompany_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


/** 产品表 */
export type ProductsProduct_SkusArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


/** 产品表 */
export type ProductsProduct_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};

/** aggregated selection of "products" */
export type Products_Aggregate = {
  __typename?: 'products_aggregate';
  aggregate?: Maybe<Products_Aggregate_Fields>;
  nodes: Array<Products>;
};

export type Products_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Products_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Products_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Products_Aggregate_Bool_Exp_Count>;
};

export type Products_Aggregate_Bool_Exp_Bool_And = {
  arguments: Products_Select_Column_Products_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Products_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Products_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Products_Select_Column_Products_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Products_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Products_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Products_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Products_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "products" */
export type Products_Aggregate_Fields = {
  __typename?: 'products_aggregate_fields';
  avg?: Maybe<Products_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Products_Max_Fields>;
  min?: Maybe<Products_Min_Fields>;
  stddev?: Maybe<Products_Stddev_Fields>;
  stddev_pop?: Maybe<Products_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Products_Stddev_Samp_Fields>;
  sum?: Maybe<Products_Sum_Fields>;
  var_pop?: Maybe<Products_Var_Pop_Fields>;
  var_samp?: Maybe<Products_Var_Samp_Fields>;
  variance?: Maybe<Products_Variance_Fields>;
};


/** aggregate fields of "products" */
export type Products_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Products_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "products" */
export type Products_Aggregate_Order_By = {
  avg?: InputMaybe<Products_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Products_Max_Order_By>;
  min?: InputMaybe<Products_Min_Order_By>;
  stddev?: InputMaybe<Products_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Products_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Products_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Products_Sum_Order_By>;
  var_pop?: InputMaybe<Products_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Products_Var_Samp_Order_By>;
  variance?: InputMaybe<Products_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "products" */
export type Products_Arr_Rel_Insert_Input = {
  data: Array<Products_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Products_On_Conflict>;
};

/** aggregate avg on columns */
export type Products_Avg_Fields = {
  __typename?: 'products_avg_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "products" */
export type Products_Avg_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "products". All fields are combined with a logical 'AND'. */
export type Products_Bool_Exp = {
  _and?: InputMaybe<Array<Products_Bool_Exp>>;
  _not?: InputMaybe<Products_Bool_Exp>;
  _or?: InputMaybe<Array<Products_Bool_Exp>>;
  category?: InputMaybe<Categories_Bool_Exp>;
  category_categories?: InputMaybe<Bigint_Comparison_Exp>;
  company?: InputMaybe<Companies_Bool_Exp>;
  company_companies?: InputMaybe<Bigint_Comparison_Exp>;
  company_products?: InputMaybe<Company_Products_Bool_Exp>;
  company_products_aggregate?: InputMaybe<Company_Products_Aggregate_Bool_Exp>;
  cover_image_url?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  detail_medias?: InputMaybe<Json_Array_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  is_shelved?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  product_skus?: InputMaybe<Product_Skus_Bool_Exp>;
  product_skus_aggregate?: InputMaybe<Product_Skus_Aggregate_Bool_Exp>;
  scene_medias?: InputMaybe<Json_Array_Comparison_Exp>;
  sort_order?: InputMaybe<Bigint_Comparison_Exp>;
  tags?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "products" */
export enum Products_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProductsPkey = 'products_pkey'
}

/** input type for incrementing numeric columns in table "products" */
export type Products_Inc_Input = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "products" */
export type Products_Insert_Input = {
  category?: InputMaybe<Categories_Obj_Rel_Insert_Input>;
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  company?: InputMaybe<Companies_Obj_Rel_Insert_Input>;
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  company_products?: InputMaybe<Company_Products_Arr_Rel_Insert_Input>;
  /** 封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 商品介绍，富文本 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 产品名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  product_skus?: InputMaybe<Product_Skus_Arr_Rel_Insert_Input>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Products_Max_Fields = {
  __typename?: 'products_max_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 封面图 */
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 商品介绍，富文本 */
  description?: Maybe<Scalars['String']['output']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: Maybe<Array<Scalars['json']['output']>>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 产品名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: Maybe<Array<Scalars['json']['output']>>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "products" */
export type Products_Max_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  /** 封面图 */
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 商品介绍，富文本 */
  description?: InputMaybe<Order_By>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品名称 */
  name?: InputMaybe<Order_By>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Products_Min_Fields = {
  __typename?: 'products_min_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  /** 封面图 */
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** 商品介绍，富文本 */
  description?: Maybe<Scalars['String']['output']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: Maybe<Array<Scalars['json']['output']>>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 产品名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: Maybe<Array<Scalars['json']['output']>>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
  /** 标签，多个用｜隔开 */
  tags?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "products" */
export type Products_Min_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  /** 封面图 */
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** 商品介绍，富文本 */
  description?: InputMaybe<Order_By>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 产品名称 */
  name?: InputMaybe<Order_By>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "products" */
export type Products_Mutation_Response = {
  __typename?: 'products_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Products>;
};

/** input type for inserting object relation for remote table "products" */
export type Products_Obj_Rel_Insert_Input = {
  data: Products_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Products_On_Conflict>;
};

/** on_conflict condition type for table "products" */
export type Products_On_Conflict = {
  constraint: Products_Constraint;
  update_columns?: Array<Products_Update_Column>;
  where?: InputMaybe<Products_Bool_Exp>;
};

/** Ordering options when selecting data from "products". */
export type Products_Order_By = {
  category?: InputMaybe<Categories_Order_By>;
  category_categories?: InputMaybe<Order_By>;
  company?: InputMaybe<Companies_Order_By>;
  company_companies?: InputMaybe<Order_By>;
  company_products_aggregate?: InputMaybe<Company_Products_Aggregate_Order_By>;
  cover_image_url?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  detail_medias?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  is_shelved?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  product_skus_aggregate?: InputMaybe<Product_Skus_Aggregate_Order_By>;
  scene_medias?: InputMaybe<Order_By>;
  sort_order?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: products */
export type Products_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "products" */
export enum Products_Select_Column {
  /** column name */
  CategoryCategories = 'category_categories',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CoverImageUrl = 'cover_image_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DetailMedias = 'detail_medias',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  SceneMedias = 'scene_medias',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "products_aggregate_bool_exp_bool_and_arguments_columns" columns of table "products" */
export enum Products_Select_Column_Products_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved'
}

/** select "products_aggregate_bool_exp_bool_or_arguments_columns" columns of table "products" */
export enum Products_Select_Column_Products_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved'
}

/** input type for updating data in table "products" */
export type Products_Set_Input = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 商品介绍，富文本 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 产品名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Products_Stddev_Fields = {
  __typename?: 'products_stddev_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "products" */
export type Products_Stddev_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Products_Stddev_Pop_Fields = {
  __typename?: 'products_stddev_pop_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "products" */
export type Products_Stddev_Pop_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Products_Stddev_Samp_Fields = {
  __typename?: 'products_stddev_samp_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "products" */
export type Products_Stddev_Samp_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "products" */
export type Products_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Products_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Products_Stream_Cursor_Value_Input = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Scalars['bigint']['input']>;
  /** 归属公司id */
  company_companies?: InputMaybe<Scalars['bigint']['input']>;
  /** 封面图 */
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** 商品介绍，富文本 */
  description?: InputMaybe<Scalars['String']['input']>;
  /** 产品信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  detail_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 是否删除 */
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  /** 是否下架 */
  is_shelved?: InputMaybe<Scalars['Boolean']['input']>;
  /** 产品名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 实景拍摄信息媒体内容，jsonb的item项（file_type=video|image、file_url） */
  scene_medias?: InputMaybe<Array<Scalars['json']['input']>>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Scalars['bigint']['input']>;
  /** 标签，多个用｜隔开 */
  tags?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Products_Sum_Fields = {
  __typename?: 'products_sum_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['bigint']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "products" */
export type Products_Sum_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** update columns of table "products" */
export enum Products_Update_Column {
  /** column name */
  CategoryCategories = 'category_categories',
  /** column name */
  CompanyCompanies = 'company_companies',
  /** column name */
  CoverImageUrl = 'cover_image_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DetailMedias = 'detail_medias',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsShelved = 'is_shelved',
  /** column name */
  Name = 'name',
  /** column name */
  SceneMedias = 'scene_medias',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Products_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Products_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Products_Set_Input>;
  /** filter the rows which have to be updated */
  where: Products_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Products_Var_Pop_Fields = {
  __typename?: 'products_var_pop_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "products" */
export type Products_Var_Pop_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Products_Var_Samp_Fields = {
  __typename?: 'products_var_samp_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "products" */
export type Products_Var_Samp_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Products_Variance_Fields = {
  __typename?: 'products_variance_fields';
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: Maybe<Scalars['Float']['output']>;
  /** 归属公司id */
  company_companies?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** 排序 越小在前面 */
  sort_order?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "products" */
export type Products_Variance_Order_By = {
  /** 所属分类id（上架时只能选系统默认公司和自己公司的分类） */
  category_categories?: InputMaybe<Order_By>;
  /** 归属公司id */
  company_companies?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 排序 越小在前面 */
  sort_order?: InputMaybe<Order_By>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** An array relationship */
  addresses: Array<Addresses>;
  /** An aggregate relationship */
  addresses_aggregate: Addresses_Aggregate;
  /** fetch data from the table: "addresses" using primary key columns */
  addresses_by_pk?: Maybe<Addresses>;
  /** An array relationship */
  carts: Array<Carts>;
  /** An aggregate relationship */
  carts_aggregate: Carts_Aggregate;
  /** fetch data from the table: "carts" using primary key columns */
  carts_by_pk?: Maybe<Carts>;
  /** An array relationship */
  categories: Array<Categories>;
  /** An aggregate relationship */
  categories_aggregate: Categories_Aggregate;
  /** fetch data from the table: "categories" using primary key columns */
  categories_by_pk?: Maybe<Categories>;
  /** fetch data from the table: "companies" */
  companies: Array<Companies>;
  /** fetch aggregated fields from the table: "companies" */
  companies_aggregate: Companies_Aggregate;
  /** fetch data from the table: "companies" using primary key columns */
  companies_by_pk?: Maybe<Companies>;
  /** An array relationship */
  company_lead_tracks: Array<Company_Lead_Tracks>;
  /** An aggregate relationship */
  company_lead_tracks_aggregate: Company_Lead_Tracks_Aggregate;
  /** fetch data from the table: "company_lead_tracks" using primary key columns */
  company_lead_tracks_by_pk?: Maybe<Company_Lead_Tracks>;
  /** An array relationship */
  company_leads: Array<Company_Leads>;
  /** An aggregate relationship */
  company_leads_aggregate: Company_Leads_Aggregate;
  /** fetch data from the table: "company_leads" using primary key columns */
  company_leads_by_pk?: Maybe<Company_Leads>;
  /** An array relationship */
  company_packages: Array<Company_Packages>;
  /** An aggregate relationship */
  company_packages_aggregate: Company_Packages_Aggregate;
  /** fetch data from the table: "company_packages" using primary key columns */
  company_packages_by_pk?: Maybe<Company_Packages>;
  /** An array relationship */
  company_products: Array<Company_Products>;
  /** An aggregate relationship */
  company_products_aggregate: Company_Products_Aggregate;
  /** fetch data from the table: "company_products" using primary key columns */
  company_products_by_pk?: Maybe<Company_Products>;
  /** An array relationship */
  company_users: Array<Company_Users>;
  /** An aggregate relationship */
  company_users_aggregate: Company_Users_Aggregate;
  /** fetch data from the table: "company_users" using primary key columns */
  company_users_by_pk?: Maybe<Company_Users>;
  /** fetch data from the table: "configs" */
  configs: Array<Configs>;
  /** fetch aggregated fields from the table: "configs" */
  configs_aggregate: Configs_Aggregate;
  /** fetch data from the table: "configs" using primary key columns */
  configs_by_pk?: Maybe<Configs>;
  /** An array relationship */
  order_items: Array<Order_Items>;
  /** An aggregate relationship */
  order_items_aggregate: Order_Items_Aggregate;
  /** fetch data from the table: "order_items" using primary key columns */
  order_items_by_pk?: Maybe<Order_Items>;
  /** An array relationship */
  orders: Array<Orders>;
  /** An aggregate relationship */
  orders_aggregate: Orders_Aggregate;
  /** fetch data from the table: "orders" using primary key columns */
  orders_by_pk?: Maybe<Orders>;
  /** An array relationship */
  package_product_skus: Array<Package_Product_Skus>;
  /** An aggregate relationship */
  package_product_skus_aggregate: Package_Product_Skus_Aggregate;
  /** fetch data from the table: "package_product_skus" using primary key columns */
  package_product_skus_by_pk?: Maybe<Package_Product_Skus>;
  /** An array relationship */
  packages: Array<Packages>;
  /** An aggregate relationship */
  packages_aggregate: Packages_Aggregate;
  /** fetch data from the table: "packages" using primary key columns */
  packages_by_pk?: Maybe<Packages>;
  /** An array relationship */
  product_skus: Array<Product_Skus>;
  /** An aggregate relationship */
  product_skus_aggregate: Product_Skus_Aggregate;
  /** fetch data from the table: "product_skus" using primary key columns */
  product_skus_by_pk?: Maybe<Product_Skus>;
  /** An array relationship */
  products: Array<Products>;
  /** An aggregate relationship */
  products_aggregate: Products_Aggregate;
  /** fetch data from the table: "products" using primary key columns */
  products_by_pk?: Maybe<Products>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootAddressesArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


export type Query_RootAddresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


export type Query_RootAddresses_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCartsArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


export type Query_RootCarts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


export type Query_RootCarts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Query_RootCategories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Query_RootCategories_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompaniesArgs = {
  distinct_on?: InputMaybe<Array<Companies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Companies_Order_By>>;
  where?: InputMaybe<Companies_Bool_Exp>;
};


export type Query_RootCompanies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Companies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Companies_Order_By>>;
  where?: InputMaybe<Companies_Bool_Exp>;
};


export type Query_RootCompanies_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompany_Lead_TracksArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


export type Query_RootCompany_Lead_Tracks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


export type Query_RootCompany_Lead_Tracks_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompany_LeadsArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


export type Query_RootCompany_Leads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


export type Query_RootCompany_Leads_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompany_PackagesArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


export type Query_RootCompany_Packages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


export type Query_RootCompany_Packages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompany_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


export type Query_RootCompany_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


export type Query_RootCompany_Products_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCompany_UsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


export type Query_RootCompany_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


export type Query_RootCompany_Users_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootConfigsArgs = {
  distinct_on?: InputMaybe<Array<Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Configs_Order_By>>;
  where?: InputMaybe<Configs_Bool_Exp>;
};


export type Query_RootConfigs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Configs_Order_By>>;
  where?: InputMaybe<Configs_Bool_Exp>;
};


export type Query_RootConfigs_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootOrder_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


export type Query_RootOrder_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


export type Query_RootOrder_Items_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootOrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


export type Query_RootOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


export type Query_RootOrders_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPackage_Product_SkusArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


export type Query_RootPackage_Product_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


export type Query_RootPackage_Product_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPackagesArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


export type Query_RootPackages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


export type Query_RootPackages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootProduct_SkusArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


export type Query_RootProduct_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


export type Query_RootProduct_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


export type Query_RootProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


export type Query_RootProducts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  addresses: Array<Addresses>;
  /** An aggregate relationship */
  addresses_aggregate: Addresses_Aggregate;
  /** fetch data from the table: "addresses" using primary key columns */
  addresses_by_pk?: Maybe<Addresses>;
  /** fetch data from the table in a streaming manner: "addresses" */
  addresses_stream: Array<Addresses>;
  /** An array relationship */
  carts: Array<Carts>;
  /** An aggregate relationship */
  carts_aggregate: Carts_Aggregate;
  /** fetch data from the table: "carts" using primary key columns */
  carts_by_pk?: Maybe<Carts>;
  /** fetch data from the table in a streaming manner: "carts" */
  carts_stream: Array<Carts>;
  /** An array relationship */
  categories: Array<Categories>;
  /** An aggregate relationship */
  categories_aggregate: Categories_Aggregate;
  /** fetch data from the table: "categories" using primary key columns */
  categories_by_pk?: Maybe<Categories>;
  /** fetch data from the table in a streaming manner: "categories" */
  categories_stream: Array<Categories>;
  /** fetch data from the table: "companies" */
  companies: Array<Companies>;
  /** fetch aggregated fields from the table: "companies" */
  companies_aggregate: Companies_Aggregate;
  /** fetch data from the table: "companies" using primary key columns */
  companies_by_pk?: Maybe<Companies>;
  /** fetch data from the table in a streaming manner: "companies" */
  companies_stream: Array<Companies>;
  /** An array relationship */
  company_lead_tracks: Array<Company_Lead_Tracks>;
  /** An aggregate relationship */
  company_lead_tracks_aggregate: Company_Lead_Tracks_Aggregate;
  /** fetch data from the table: "company_lead_tracks" using primary key columns */
  company_lead_tracks_by_pk?: Maybe<Company_Lead_Tracks>;
  /** fetch data from the table in a streaming manner: "company_lead_tracks" */
  company_lead_tracks_stream: Array<Company_Lead_Tracks>;
  /** An array relationship */
  company_leads: Array<Company_Leads>;
  /** An aggregate relationship */
  company_leads_aggregate: Company_Leads_Aggregate;
  /** fetch data from the table: "company_leads" using primary key columns */
  company_leads_by_pk?: Maybe<Company_Leads>;
  /** fetch data from the table in a streaming manner: "company_leads" */
  company_leads_stream: Array<Company_Leads>;
  /** An array relationship */
  company_packages: Array<Company_Packages>;
  /** An aggregate relationship */
  company_packages_aggregate: Company_Packages_Aggregate;
  /** fetch data from the table: "company_packages" using primary key columns */
  company_packages_by_pk?: Maybe<Company_Packages>;
  /** fetch data from the table in a streaming manner: "company_packages" */
  company_packages_stream: Array<Company_Packages>;
  /** An array relationship */
  company_products: Array<Company_Products>;
  /** An aggregate relationship */
  company_products_aggregate: Company_Products_Aggregate;
  /** fetch data from the table: "company_products" using primary key columns */
  company_products_by_pk?: Maybe<Company_Products>;
  /** fetch data from the table in a streaming manner: "company_products" */
  company_products_stream: Array<Company_Products>;
  /** An array relationship */
  company_users: Array<Company_Users>;
  /** An aggregate relationship */
  company_users_aggregate: Company_Users_Aggregate;
  /** fetch data from the table: "company_users" using primary key columns */
  company_users_by_pk?: Maybe<Company_Users>;
  /** fetch data from the table in a streaming manner: "company_users" */
  company_users_stream: Array<Company_Users>;
  /** fetch data from the table: "configs" */
  configs: Array<Configs>;
  /** fetch aggregated fields from the table: "configs" */
  configs_aggregate: Configs_Aggregate;
  /** fetch data from the table: "configs" using primary key columns */
  configs_by_pk?: Maybe<Configs>;
  /** fetch data from the table in a streaming manner: "configs" */
  configs_stream: Array<Configs>;
  /** An array relationship */
  order_items: Array<Order_Items>;
  /** An aggregate relationship */
  order_items_aggregate: Order_Items_Aggregate;
  /** fetch data from the table: "order_items" using primary key columns */
  order_items_by_pk?: Maybe<Order_Items>;
  /** fetch data from the table in a streaming manner: "order_items" */
  order_items_stream: Array<Order_Items>;
  /** An array relationship */
  orders: Array<Orders>;
  /** An aggregate relationship */
  orders_aggregate: Orders_Aggregate;
  /** fetch data from the table: "orders" using primary key columns */
  orders_by_pk?: Maybe<Orders>;
  /** fetch data from the table in a streaming manner: "orders" */
  orders_stream: Array<Orders>;
  /** An array relationship */
  package_product_skus: Array<Package_Product_Skus>;
  /** An aggregate relationship */
  package_product_skus_aggregate: Package_Product_Skus_Aggregate;
  /** fetch data from the table: "package_product_skus" using primary key columns */
  package_product_skus_by_pk?: Maybe<Package_Product_Skus>;
  /** fetch data from the table in a streaming manner: "package_product_skus" */
  package_product_skus_stream: Array<Package_Product_Skus>;
  /** An array relationship */
  packages: Array<Packages>;
  /** An aggregate relationship */
  packages_aggregate: Packages_Aggregate;
  /** fetch data from the table: "packages" using primary key columns */
  packages_by_pk?: Maybe<Packages>;
  /** fetch data from the table in a streaming manner: "packages" */
  packages_stream: Array<Packages>;
  /** An array relationship */
  product_skus: Array<Product_Skus>;
  /** An aggregate relationship */
  product_skus_aggregate: Product_Skus_Aggregate;
  /** fetch data from the table: "product_skus" using primary key columns */
  product_skus_by_pk?: Maybe<Product_Skus>;
  /** fetch data from the table in a streaming manner: "product_skus" */
  product_skus_stream: Array<Product_Skus>;
  /** An array relationship */
  products: Array<Products>;
  /** An aggregate relationship */
  products_aggregate: Products_Aggregate;
  /** fetch data from the table: "products" using primary key columns */
  products_by_pk?: Maybe<Products>;
  /** fetch data from the table in a streaming manner: "products" */
  products_stream: Array<Products>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
};


export type Subscription_RootAddressesArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


export type Subscription_RootAddresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


export type Subscription_RootAddresses_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootAddresses_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Addresses_Stream_Cursor_Input>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


export type Subscription_RootCartsArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


export type Subscription_RootCarts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


export type Subscription_RootCarts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCarts_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Carts_Stream_Cursor_Input>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


export type Subscription_RootCategoriesArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Subscription_RootCategories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Categories_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Categories_Order_By>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Subscription_RootCategories_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCategories_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Categories_Stream_Cursor_Input>>;
  where?: InputMaybe<Categories_Bool_Exp>;
};


export type Subscription_RootCompaniesArgs = {
  distinct_on?: InputMaybe<Array<Companies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Companies_Order_By>>;
  where?: InputMaybe<Companies_Bool_Exp>;
};


export type Subscription_RootCompanies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Companies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Companies_Order_By>>;
  where?: InputMaybe<Companies_Bool_Exp>;
};


export type Subscription_RootCompanies_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompanies_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Companies_Stream_Cursor_Input>>;
  where?: InputMaybe<Companies_Bool_Exp>;
};


export type Subscription_RootCompany_Lead_TracksArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


export type Subscription_RootCompany_Lead_Tracks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Lead_Tracks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Lead_Tracks_Order_By>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


export type Subscription_RootCompany_Lead_Tracks_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompany_Lead_Tracks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Company_Lead_Tracks_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Lead_Tracks_Bool_Exp>;
};


export type Subscription_RootCompany_LeadsArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


export type Subscription_RootCompany_Leads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


export type Subscription_RootCompany_Leads_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompany_Leads_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Company_Leads_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


export type Subscription_RootCompany_PackagesArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


export type Subscription_RootCompany_Packages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Packages_Order_By>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


export type Subscription_RootCompany_Packages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompany_Packages_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Company_Packages_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Packages_Bool_Exp>;
};


export type Subscription_RootCompany_ProductsArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


export type Subscription_RootCompany_Products_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Products_Order_By>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


export type Subscription_RootCompany_Products_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompany_Products_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Company_Products_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Products_Bool_Exp>;
};


export type Subscription_RootCompany_UsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


export type Subscription_RootCompany_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


export type Subscription_RootCompany_Users_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootCompany_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Company_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


export type Subscription_RootConfigsArgs = {
  distinct_on?: InputMaybe<Array<Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Configs_Order_By>>;
  where?: InputMaybe<Configs_Bool_Exp>;
};


export type Subscription_RootConfigs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Configs_Order_By>>;
  where?: InputMaybe<Configs_Bool_Exp>;
};


export type Subscription_RootConfigs_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootConfigs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Configs_Stream_Cursor_Input>>;
  where?: InputMaybe<Configs_Bool_Exp>;
};


export type Subscription_RootOrder_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


export type Subscription_RootOrder_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Order_Items_Order_By>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


export type Subscription_RootOrder_Items_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootOrder_Items_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Order_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Order_Items_Bool_Exp>;
};


export type Subscription_RootOrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


export type Subscription_RootOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


export type Subscription_RootOrders_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootOrders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Orders_Stream_Cursor_Input>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


export type Subscription_RootPackage_Product_SkusArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


export type Subscription_RootPackage_Product_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Package_Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Package_Product_Skus_Order_By>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


export type Subscription_RootPackage_Product_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPackage_Product_Skus_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Package_Product_Skus_Stream_Cursor_Input>>;
  where?: InputMaybe<Package_Product_Skus_Bool_Exp>;
};


export type Subscription_RootPackagesArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


export type Subscription_RootPackages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Packages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Packages_Order_By>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


export type Subscription_RootPackages_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPackages_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Packages_Stream_Cursor_Input>>;
  where?: InputMaybe<Packages_Bool_Exp>;
};


export type Subscription_RootProduct_SkusArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


export type Subscription_RootProduct_Skus_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Product_Skus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Product_Skus_Order_By>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


export type Subscription_RootProduct_Skus_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootProduct_Skus_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Product_Skus_Stream_Cursor_Input>>;
  where?: InputMaybe<Product_Skus_Bool_Exp>;
};


export type Subscription_RootProductsArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


export type Subscription_RootProducts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Products_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Products_Order_By>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


export type Subscription_RootProducts_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootProducts_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Products_Stream_Cursor_Input>>;
  where?: InputMaybe<Products_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** 用户表 */
export type Users = {
  __typename?: 'users';
  /** An array relationship */
  addresses: Array<Addresses>;
  /** An aggregate relationship */
  addresses_aggregate: Addresses_Aggregate;
  /** 头像 */
  avatar_url?: Maybe<Scalars['String']['output']>;
  /** 简介 */
  bio?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  carts: Array<Carts>;
  /** An aggregate relationship */
  carts_aggregate: Carts_Aggregate;
  /** An array relationship */
  company_leads: Array<Company_Leads>;
  /** An aggregate relationship */
  company_leads_aggregate: Company_Leads_Aggregate;
  /** An array relationship */
  company_users: Array<Company_Users>;
  /** An aggregate relationship */
  company_users_aggregate: Company_Users_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  /** 手机号（唯一） */
  mobile?: Maybe<Scalars['String']['output']>;
  /** 昵称 */
  nickname?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  orders: Array<Orders>;
  /** An aggregate relationship */
  orders_aggregate: Orders_Aggregate;
  /** 密码，md5 32位小写 */
  password?: Maybe<Scalars['String']['output']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: Maybe<Scalars['String']['output']>;
};


/** 用户表 */
export type UsersAddressesArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


/** 用户表 */
export type UsersAddresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Addresses_Order_By>>;
  where?: InputMaybe<Addresses_Bool_Exp>;
};


/** 用户表 */
export type UsersCartsArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


/** 用户表 */
export type UsersCarts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Carts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Carts_Order_By>>;
  where?: InputMaybe<Carts_Bool_Exp>;
};


/** 用户表 */
export type UsersCompany_LeadsArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 用户表 */
export type UsersCompany_Leads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Leads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Leads_Order_By>>;
  where?: InputMaybe<Company_Leads_Bool_Exp>;
};


/** 用户表 */
export type UsersCompany_UsersArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


/** 用户表 */
export type UsersCompany_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Company_Users_Order_By>>;
  where?: InputMaybe<Company_Users_Bool_Exp>;
};


/** 用户表 */
export type UsersOrdersArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};


/** 用户表 */
export type UsersOrders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Orders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Orders_Order_By>>;
  where?: InputMaybe<Orders_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: 'users_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  addresses?: InputMaybe<Addresses_Bool_Exp>;
  addresses_aggregate?: InputMaybe<Addresses_Aggregate_Bool_Exp>;
  avatar_url?: InputMaybe<String_Comparison_Exp>;
  bio?: InputMaybe<String_Comparison_Exp>;
  carts?: InputMaybe<Carts_Bool_Exp>;
  carts_aggregate?: InputMaybe<Carts_Aggregate_Bool_Exp>;
  company_leads?: InputMaybe<Company_Leads_Bool_Exp>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Bool_Exp>;
  company_users?: InputMaybe<Company_Users_Bool_Exp>;
  company_users_aggregate?: InputMaybe<Company_Users_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  mobile?: InputMaybe<String_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  orders?: InputMaybe<Orders_Bool_Exp>;
  orders_aggregate?: InputMaybe<Orders_Aggregate_Bool_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  wx_mini_openid?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "mobile" */
  UsersMobileKey = 'users_mobile_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
  /** unique or primary key constraint on columns "wx_mini_openid" */
  UsersWxMiniOpenidKey = 'users_wx_mini_openid_key'
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  addresses?: InputMaybe<Addresses_Arr_Rel_Insert_Input>;
  /** 头像 */
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  /** 简介 */
  bio?: InputMaybe<Scalars['String']['input']>;
  carts?: InputMaybe<Carts_Arr_Rel_Insert_Input>;
  company_leads?: InputMaybe<Company_Leads_Arr_Rel_Insert_Input>;
  company_users?: InputMaybe<Company_Users_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 手机号（唯一） */
  mobile?: InputMaybe<Scalars['String']['input']>;
  /** 昵称 */
  nickname?: InputMaybe<Scalars['String']['input']>;
  orders?: InputMaybe<Orders_Arr_Rel_Insert_Input>;
  /** 密码，md5 32位小写 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  /** 头像 */
  avatar_url?: Maybe<Scalars['String']['output']>;
  /** 简介 */
  bio?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 手机号（唯一） */
  mobile?: Maybe<Scalars['String']['output']>;
  /** 昵称 */
  nickname?: Maybe<Scalars['String']['output']>;
  /** 密码，md5 32位小写 */
  password?: Maybe<Scalars['String']['output']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  /** 头像 */
  avatar_url?: Maybe<Scalars['String']['output']>;
  /** 简介 */
  bio?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  /** 手机号（唯一） */
  mobile?: Maybe<Scalars['String']['output']>;
  /** 昵称 */
  nickname?: Maybe<Scalars['String']['output']>;
  /** 密码，md5 32位小写 */
  password?: Maybe<Scalars['String']['output']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  addresses_aggregate?: InputMaybe<Addresses_Aggregate_Order_By>;
  avatar_url?: InputMaybe<Order_By>;
  bio?: InputMaybe<Order_By>;
  carts_aggregate?: InputMaybe<Carts_Aggregate_Order_By>;
  company_leads_aggregate?: InputMaybe<Company_Leads_Aggregate_Order_By>;
  company_users_aggregate?: InputMaybe<Company_Users_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mobile?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  orders_aggregate?: InputMaybe<Orders_Aggregate_Order_By>;
  password?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  wx_mini_openid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  Bio = 'bio',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Mobile = 'mobile',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Password = 'password',
  /** column name */
  Role = 'role',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxMiniOpenid = 'wx_mini_openid'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  /** 头像 */
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  /** 简介 */
  bio?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 手机号（唯一） */
  mobile?: InputMaybe<Scalars['String']['input']>;
  /** 昵称 */
  nickname?: InputMaybe<Scalars['String']['input']>;
  /** 密码，md5 32位小写 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: 'users_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: 'users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: 'users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  /** 头像 */
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  /** 简介 */
  bio?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  /** 手机号（唯一） */
  mobile?: InputMaybe<Scalars['String']['input']>;
  /** 昵称 */
  nickname?: InputMaybe<Scalars['String']['input']>;
  /** 密码，md5 32位小写 */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 用户角色 1.user（普通用户）2.admin（平台管理员）3.wx_guest_user（微信的匿名访客） */
  role?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  /** role= wx_guest_user时用户的小程序openid */
  wx_mini_openid?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: 'users_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  Bio = 'bio',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Mobile = 'mobile',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Password = 'password',
  /** column name */
  Role = 'role',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WxMiniOpenid = 'wx_mini_openid'
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: 'users_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: 'users_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: 'users_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};
