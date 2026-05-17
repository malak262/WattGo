/*
  # WattGo - Initial Schema

  1. New Tables
    - `profiles` - User profiles with student card info, phone, deposit status
      - `id` (uuid, PK, FK to auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `student_card_number` (text)
      - `avatar_url` (text)
      - `deposit_paid` (boolean, default false)
      - `deposit_amount` (numeric, default 0)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
    - `stations` - Charging/parking stations in Oujda
      - `id` (uuid, PK)
      - `name` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `address` (text)
      - `capacity` (integer)
      - `created_at` (timestamptz)
    - `scooters` - Electric scooters
      - `id` (uuid, PK)
      - `station_id` (uuid, FK to stations)
      - `code` (text, unique) - scooter identifier code
      - `battery_level` (integer, default 100)
      - `status` (text, default 'available') - available, reserved, in_use, maintenance
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `pin_code` (text) - unlock PIN
      - `created_at` (timestamptz)
    - `rides` - Ride sessions
      - `id` (uuid, PK)
      - `user_id` (uuid, FK to profiles)
      - `scooter_id` (uuid, FK to scooters)
      - `start_station_id` (uuid, FK to stations)
      - `end_station_id` (uuid, FK to stations, nullable)
      - `status` (text, default 'reserved') - reserved, active, completed, cancelled
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `start_latitude` (double precision)
      - `start_longitude` (double precision)
      - `end_latitude` (double precision, nullable)
      - `end_longitude` (double precision, nullable)
      - `duration_minutes` (integer, nullable)
      - `price` (numeric, nullable)
      - `created_at` (timestamptz)
    - `payments` - Payment records
      - `id` (uuid, PK)
      - `user_id` (uuid, FK to profiles)
      - `ride_id` (uuid, FK to rides, nullable)
      - `amount` (numeric)
      - `payment_method` (text) - card, transfer, cash
      - `status` (text, default 'pending') - pending, completed, failed
      - `created_at` (timestamptz)
    - `subscriptions` - User subscriptions
      - `id` (uuid, PK)
      - `user_id` (uuid, FK to profiles)
      - `plan` (text) - monthly, semester
      - `price` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (text, default 'active') - active, expired, cancelled
      - `created_at` (timestamptz)
    - `badges` - Loyalty badges
      - `id` (uuid, PK)
      - `user_id` (uuid, FK to profiles)
      - `name` (text)
      - `description` (text)
      - `earned_at` (timestamptz)
    - `alerts` - Admin alerts for GPS zone violations
      - `id` (uuid, PK)
      - `scooter_id` (uuid, FK to scooters)
      - `ride_id` (uuid, FK to rides, nullable)
      - `type` (text) - zone_violation, low_battery, maintenance
      - `message` (text)
      - `resolved` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read/update own profile
    - Stations and scooters are readable by all authenticated users
    - Rides are readable by the user who owns them
    - Payments are readable by the user who owns them
    - Subscriptions are readable by the user who owns them
    - Badges are readable by the user who owns them
    - Admins can read/write all tables
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  student_card_number text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  deposit_paid boolean DEFAULT false,
  deposit_amount numeric DEFAULT 0,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Stations
CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read stations"
  ON stations FOR SELECT
  TO authenticated
  USING (true);

-- Scooters
CREATE TABLE IF NOT EXISTS scooters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id uuid NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  battery_level integer DEFAULT 100,
  status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'in_use', 'maintenance')),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  pin_code text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scooters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read scooters"
  ON scooters FOR SELECT
  TO authenticated
  USING (true);

-- Rides
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scooter_id uuid NOT NULL REFERENCES scooters(id) ON DELETE CASCADE,
  start_station_id uuid NOT NULL REFERENCES stations(id),
  end_station_id uuid REFERENCES stations(id),
  status text DEFAULT 'reserved' CHECK (status IN ('reserved', 'active', 'completed', 'cancelled')),
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  start_latitude double precision NOT NULL,
  start_longitude double precision NOT NULL,
  end_latitude double precision,
  end_longitude double precision,
  duration_minutes integer,
  price numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES rides(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'transfer', 'cash')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('monthly', 'semester')),
  price numeric NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scooter_id uuid NOT NULL REFERENCES scooters(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES rides(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('zone_violation', 'low_battery', 'maintenance')),
  message text NOT NULL DEFAULT '',
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scooters_station ON scooters(station_id);
CREATE INDEX IF NOT EXISTS idx_scooters_status ON scooters(status);
CREATE INDEX IF NOT EXISTS idx_rides_user ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_scooter ON alerts(scooter_id);
