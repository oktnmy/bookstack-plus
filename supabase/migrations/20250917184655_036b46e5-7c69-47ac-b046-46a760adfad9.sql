-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'librarian', 'member')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  publisher TEXT,
  publication_year INTEGER,
  genre TEXT,
  description TEXT,
  cover_url TEXT,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create borrowing records table
CREATE TABLE public.borrowing_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  borrowed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  returned_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowing_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Books policies (readable by everyone, manageable by librarians/admins)
CREATE POLICY "Books are viewable by authenticated users" 
ON public.books 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Librarians and admins can manage books" 
ON public.books 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('librarian', 'admin')
  )
);

-- Borrowing records policies
CREATE POLICY "Users can view their own borrowing records" 
ON public.borrowing_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own borrowing records" 
ON public.borrowing_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Librarians can view all borrowing records" 
ON public.borrowing_records 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('librarian', 'admin')
  )
);

CREATE POLICY "Librarians can update borrowing records" 
ON public.borrowing_records 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('librarian', 'admin')
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_borrowing_records_updated_at
BEFORE UPDATE ON public.borrowing_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample books data
INSERT INTO public.books (title, author, isbn, publisher, publication_year, genre, description, total_copies, available_copies, location) VALUES
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Harper Perennial Modern Classics', 1960, 'Fiction', 'A gripping tale of racial injustice and childhood innocence in the American South.', 5, 5, 'A-101'),
('1984', 'George Orwell', '9780451524935', 'Signet Classics', 1949, 'Dystopian Fiction', 'A dystopian social science fiction novel about totalitarian control.', 8, 8, 'A-102'),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Penguin Classics', 1813, 'Romance', 'A romantic novel about manners, upbringing, morality, education, and marriage.', 6, 6, 'A-103'),
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Scribner', 1925, 'Fiction', 'A critique of the American Dream set in the Jazz Age.', 7, 7, 'A-104'),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 'Little, Brown and Company', 1951, 'Fiction', 'A controversial novel about teenage rebellion and alienation.', 4, 4, 'A-105'),
('Lord of the Flies', 'William Golding', '9780571056866', 'Faber & Faber', 1954, 'Fiction', 'A novel about a group of boys stranded on a desert island.', 5, 5, 'A-106'),
('The Chronicles of Narnia', 'C.S. Lewis', '9780066238501', 'HarperCollins', 1950, 'Fantasy', 'A series of seven fantasy novels set in the magical land of Narnia.', 10, 10, 'B-201'),
('Harry Potter and the Sorcerers Stone', 'J.K. Rowling', '9780439708180', 'Scholastic', 1997, 'Fantasy', 'The first book in the Harry Potter series about a young wizard.', 12, 12, 'B-202'),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 'Houghton Mifflin Harcourt', 1937, 'Fantasy', 'A fantasy novel about the journey of Bilbo Baggins.', 8, 8, 'B-203'),
('Dune', 'Frank Herbert', '9780441013593', 'Ace Books', 1965, 'Science Fiction', 'A science fiction novel set in the distant future.', 6, 6, 'C-301'),
('The Martian', 'Andy Weir', '9780553418026', 'Del Rey', 2011, 'Science Fiction', 'A story about an astronaut stranded on Mars.', 5, 5, 'C-302'),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 'Harper', 2014, 'Non-fiction', 'A brief history of humankind from the Stone Age to the present.', 4, 4, 'D-401'),
('Educated', 'Tara Westover', '9780399590504', 'Random House', 2018, 'Memoir', 'A memoir about education and family in rural Idaho.', 3, 3, 'D-402'),
('The Art of War', 'Sun Tzu', '9781599869773', 'SoHo Books', 500, 'Philosophy', 'An ancient Chinese military treatise on strategy and warfare.', 2, 2, 'E-501'),
('Thinking, Fast and Slow', 'Daniel Kahneman', '9780374533557', 'Farrar, Straus and Giroux', 2011, 'Psychology', 'A book about the two systems that drive the way we think.', 4, 4, 'E-502');