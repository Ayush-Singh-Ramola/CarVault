import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useAuth } from '@hooks/useAuth';
import { favoriteService } from '@services/favoriteService';

export default function FavoriteButton({
  carId,
  initialFavorited = false,
  size = 18,
  className,
  onChange,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isLoading) return;

    const next = !isFavorited;
    setIsLoading(true);
    setIsFavorited(next);

    try {
      if (next) {
        await favoriteService.addFavorite(carId);
      } else {
        await favoriteService.removeFavorite(carId);
      }
      onChange?.(next);
    } catch (err) {
      setIsFavorited(!next);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={clsx('grid place-items-center rounded-full transition-transform active:scale-90', className)}
    >
      <Heart
        size={size}
        className={clsx(
          'transition-colors',
          isFavorited ? 'fill-accent-500 text-accent-500' : 'text-gray-500 dark:text-gray-300'
        )}
      />
    </button>
  );
}