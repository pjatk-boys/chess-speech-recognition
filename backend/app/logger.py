import logging


def setup_custom_logger(name, log_level: int = 20):
    """
        Setup custom logger with name given in 'name' parameters
        :params:
        name(string): name of custom logger
    """
    formatter = logging.Formatter(fmt='[%(asctime)s] [%(levelname)s] '
                                      '[%(module)s.%(funcName)s:%(lineno)d] %(message)s')

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    logger.addHandler(handler)
    return logger
