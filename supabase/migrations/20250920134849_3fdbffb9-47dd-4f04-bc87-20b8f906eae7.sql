-- Add student_id column to profiles table for better student identification
ALTER TABLE public.profiles 
ADD COLUMN student_id TEXT;

-- Create index for better performance on student_id lookups
CREATE INDEX idx_profiles_student_id ON public.profiles(student_id);

-- Update the handle_new_user function to include student_id from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, student_id, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'student_id',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'member')
  );
  RETURN NEW;
END;
$function$;