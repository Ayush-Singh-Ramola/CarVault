import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Star, Trash2 } from 'lucide-react';
import { reviewService } from '@services/reviewService';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import FormTextarea from '@components/ui/FormTextarea';
import { formatDate } from '@utils/formatters';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Please select a rating').max(5),
  comment: z.string().trim().max(1000).optional(),
});

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button type="button" key={star} onClick={() => onChange(star)} className="p-0.5">
          <Star
            size={22}
            className={
              star <= value
                ? 'fill-accent-500 text-accent-500'
                : 'text-gray-300 dark:text-gray-700'
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ carId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, comment: '' } });

  const ratingValue = watch('rating');

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.getReviewsForCar(carId, { page: 1, limit: 20 });
      setReviews(res.data.reviews);
      setMeta(res.meta);
    } catch {
      // non-critical — section just stays empty
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const myReview = reviews.find((r) => r.user?.id === user?.id);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await reviewService.submitReview(carId, data);
      toast.success('Review submitted');
      reset({ rating: 0, comment: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="mt-6 card p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Reviews {meta && `(${meta.total})`}
      </h2>

      {isAuthenticated && !myReview && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Leave a review
          </p>
          <StarRatingInput
            value={ratingValue}
            onChange={(v) => setValue('rating', v, { shouldValidate: true })}
          />
          {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
          <div className="mt-3">
            <FormTextarea
              placeholder="Share your experience with this car…"
              rows={3}
              {...register('comment')}
            />
          </div>
          <Button type="submit" isLoading={isSubmitting} className="!w-auto px-6 mt-3">
            Submit review
          </Button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400">
          No reviews yet. Be the first to share your experience.
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <span className="grid place-items-center h-9 w-9 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold">
                {review.user.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.user.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={
                            s <= review.rating
                              ? 'fill-accent-500 text-accent-500'
                              : 'text-gray-300 dark:text-gray-700'
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {(review.user.id === user?.id || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}