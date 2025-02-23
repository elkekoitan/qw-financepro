-- Create UserStatus enum
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);
CREATE INDEX IF NOT EXISTS users_status_idx ON public.users (status);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow authenticated users to update their own data
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to manage all users
CREATE POLICY "Service role can manage all users" ON public.users
  USING (auth.role() = 'service_role');

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the new user with hashed password
  INSERT INTO public.users (id, email, password, name, status)
  VALUES (
    NEW.id,
    NEW.email,
    crypt(NEW.raw_user_meta_data->>'password', gen_salt('bf')),
    NEW.raw_user_meta_data->>'name',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle password updates
CREATE OR REPLACE FUNCTION public.handle_password_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the password only if it has changed
  IF NEW.encrypted_password != OLD.encrypted_password THEN
    UPDATE public.users
    SET password = crypt(NEW.encrypted_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password)
  EXECUTE FUNCTION public.handle_password_update(); 