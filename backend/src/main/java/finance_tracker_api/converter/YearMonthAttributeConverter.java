package finance_tracker_api.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.YearMonth;

/**
 * JPA attribute converter that persists {@link YearMonth} values as
 * strings in the {@code YYYY-MM} format.
 */
@Converter(
        autoApply = true
)
public class YearMonthAttributeConverter
        implements AttributeConverter<
                YearMonth,
                String
        > {

    /**
     * Converts a {@link YearMonth} to its {@code YYYY-MM} string form.
     *
     * @param attribute the value to convert (may be {@code null})
     * @return the string representation, or {@code null}
     */
    @Override
    public String convertToDatabaseColumn(
            YearMonth attribute
    ) {

        if (attribute == null) {
            return null;
        }

        return attribute.toString();
    }

    /**
     * Parses a {@code YYYY-MM} database value back into a
     * {@link YearMonth}.
     *
     * @param dbData the stored value (may be {@code null})
     * @return the parsed instance, or {@code null}
     */
    @Override
    public YearMonth convertToEntityAttribute(
            String dbData
    ) {

        if (dbData == null) {
            return null;
        }

        return YearMonth.parse(
                dbData
        );
    }
}
