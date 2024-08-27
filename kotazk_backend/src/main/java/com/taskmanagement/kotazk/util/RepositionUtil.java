package com.taskmanagement.kotazk.util;

import static com.taskmanagement.kotazk.config.ConstantConfig.*;

public class RepositionUtil {

    /**
     * Tính toán vị trí mới giữa previousPosition và nextPosition.
     * Nếu cả hai đều null, trả về giá trị mặc định.
     * Nếu chỉ có previousPosition hoặc nextPosition, tính toán vị trí ở đầu hoặc cuối.
     *
     * @param previousPosition Vị trí trước đó (có thể null)
     * @param nextPosition Vị trí sau đó (có thể null)
     * @return Vị trí mới là một số nguyên
     */
    public static Long calculateNewPosition(Long previousPosition, Long nextPosition) {
        if (previousPosition == null && nextPosition == null) {
            return DEFAULT_POSITION_STEP;
        } else if (previousPosition == null) {
            return nextPosition / 2;
        } else if (nextPosition == null) {
            return previousPosition + DEFAULT_POSITION_STEP;
        } else {
            return (previousPosition + nextPosition) / 2;
        }
    }

    public static Long calculateNewLastPosition(Integer numberOfItems) {
        return numberOfItems * DEFAULT_POSITION_STEP;
    }
}
